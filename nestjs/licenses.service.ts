import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as _ from "lodash";
import { License, LicenseDocument } from "./schemas/license.schema";
import { StoresService } from "../stores/stores.service";
import { TypeOfOperationsService } from "../type_of_operations/type_of_operations.service";
import { databaseProviders } from "src/core/database/database.providers";
import { CreateLicenseDto } from "./dto/create.license.dto";
import { LicenseProps } from "./types";
import { PAGE_SIZE } from "src/common";

@Injectable()
export class LicensesService {
  constructor(
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
    private readonly storeService: StoresService,
    private readonly typeOfOperationService: TypeOfOperationsService
  ) {}

  async syncLicenses(opportunity_id?: string) {
    // set deleted_at_itw field default value

    // mongodb stores
    const stores = await this.storeService.findByItwOptions({
      deleted_at_itw: !1,
    });

    await this.licenseModel
      .updateMany(
        { itw_opportunity_id: opportunity_id },
        { $set: { deleted_at_itw: true } }
      )
      .exec();

    const buildingIds: string[] = _.uniqBy(
      stores,
      (store: any) => store.itw_building_id
    ).map((uniqueBuilding: any) => uniqueBuilding.itw_building_id);

    let queryString = `SELECT AV.id, AV.opportunity_id, AV.page_name, AV.question_name, AV.question_text, AV.value, AV.value_index, AV.building_id \
      FROM Interview_DataTypes_AnswerVault AS AV \
      WHERE \
      AV.page_name = 'CL Cannabis Licenses' AND \
      AV.building_id IN ('${buildingIds.join("','")}') AND \
      AV.question_name IN ( \
        'CL_CannabisLicNumber', \
        'CL_CannabisLicCost', \
        'CL_CannabisLicEffDt', \
        'CL_CannabisLicExpDt', \
        'CL_CannabisOperations' \
      )`;

    // update query if opportunity_id given
    if (opportunity_id) {
      queryString += ` AND AV.opportunity_id = '${opportunity_id}'`;
    }

    const [results, metadata] = await (
      await databaseProviders[0].useFactory()
    ).query(queryString);

    let itw_operations: any[] = results.filter(
      (items: any) => items.question_name === "CL_CannabisOperations"
    );
    if (itw_operations.length) {
      itw_operations = _.uniq([
        ...itw_operations
          .map((itw_operation: any) => itw_operation.value)
          .reduce((e: string[], t: string) => {
            e = [...e, ...t.split("::")];
            return e;
          }, []),
      ]);

      const mongo_operations = await this.typeOfOperationService.findByOptions({
        title: {
          $in: itw_operations,
        },
      });

      const resultsByOpportunity = await _.groupBy(results, "opportunity_id");
      _.keys(resultsByOpportunity).map((opportunityId: string) => {
        console.log("opportunityId : ", opportunityId);
        const opportunityResults = resultsByOpportunity[opportunityId];
        console.log("total : ", opportunityResults.length);
        const resultsByBuilding = _.groupBy(opportunityResults, "building_id");
        console.log("total buildings : ", _.keys(resultsByBuilding));
        _.keys(resultsByBuilding).map(async (buildingKey: string) => {
          try {
            let licenseOperations: any = null;
            let licenseNumber: any = null;
            let licenseCost: any = null;
            let licenseEffectiveDate: any = null;
            let licenseExpiryDate: any = null;
            const buildingResults: any[] = resultsByBuilding[buildingKey];
            // check LicenseType
            if (
              buildingResults.find(
                (buildingResult: any) =>
                  buildingResult.question_name === "CL_CannabisOperations"
              )
            ) {
              const buildingStore: any = stores?.find(
                (store: any) => store.itw_building_id === buildingKey
              );
              let storeId: string = "";
              if (buildingStore) {
                storeId = buildingStore._id;
              }

              buildingResults.forEach((buildingResult: any) => {
                switch (buildingResult.question_name) {
                  case "CL_CannabisOperations":
                    licenseOperations = buildingResult.value;
                    break;
                  case "CL_CannabisLicNumber":
                    licenseNumber = buildingResult.value;
                    break;
                  case "CL_CannabisLicCost":
                    licenseCost = buildingResult.value;
                    break;
                  case "CL_CannabisLicEffDt":
                    licenseEffectiveDate = buildingResult.value;
                    break;
                  case "CL_CannabisLicExpDt":
                    licenseExpiryDate = buildingResult.value;
                    break;
                }
              });

              const uniqueOperations = _.uniq(licenseOperations.split("::"));
              uniqueOperations.forEach(async (uniqueOperation: string) => {
                const operation: any = mongo_operations.find(
                  (mongo_operation: any) =>
                    mongo_operation.title === uniqueOperation
                );
                if (operation) {
                  const newItem = {
                    user: process.env.userId,
                    opportunity_id: buildingResults.length
                      ? buildingResults[0].opportunity_id
                      : "XXX-XXX-XXX-XXX",
                    license_type: operation.title,
                    license_number: licenseNumber ? licenseNumber : "",
                    license_cost: licenseCost ? licenseCost : "",
                    license_effective_date: licenseEffectiveDate
                      ? licenseEffectiveDate
                      : "",
                    license_expiry_date: licenseExpiryDate
                      ? licenseExpiryDate
                      : "",
                    store: storeId,
                    type_of_operation: operation._id,
                    updated_at: new Date(),
                    deleted_at_itw: false,
                  };

                  const query = {
                    user: process.env.userId,
                    opportunity_id: opportunity_id,
                    store: storeId,
                    type_of_operation: operation._id,
                  };
                  const options = { upsert: true, new: true };
                  await this.licenseModel
                    .findOneAndUpdate<License>(query, { ...newItem }, options)
                    .exec();
                }
              });
            }
          } catch (e) {}
        });
      });
    }

    return results;
  }

  async findByParams(options: any, user: any) {
    options.page = parseInt(options?.page ?? 0);
    const query = this.queryQuotes(options, user.id);
    let sorted = {};
    if (options.expiry_date_start) {
      sorted = {
        ...sorted,
        sort: {
          license_expiry_date: 1,
        },
        // limit: options.limit,
      }; // ASC Order
    }

    if (options.unique_states) {
      return {
        status: 200,
        success: true,
        error: false,
        licenses: await this.licenseModel
          .find(query)
          .distinct<License>("store.location.state"),
      };
    }

    const total = await this.licenseModel.find(query).count();
    const pages = Math.ceil(total / PAGE_SIZE);
    const results = await this.licenseModel
      .find<License>(query, null, sorted)
      .skip(options.page * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate({ path: "user", select: ["firstName", "lastName", "email"] })
      .populate({
        path: "store",
        select: ["building_name", "building_number", "location"],
      })
      .populate({
        path: "type_of_operation",
        select: ["title", "icon", "color_code", "color_class"],
      })
      // .sort({ license_expiry_date: 1 }) // Sort by license_expiry_date Added ASC
      .exec();

    return {
      count: total,
      pages,
      results,
    };
  }

  async deleteLicenses() {
    await this.licenseModel.deleteMany({}).exec();
  }

  private queryQuotes(options: any, userId: string) {
    let query: any = {
      user: new Types.ObjectId(userId),
      deleted_at_itw: !1,
    };

    if (options.type_of_operation) {
      query = {
        ...query,
        type_of_operation: {
          $regex: `^${options.type_of_operation}$`,
          $options: "i",
        },
      };
    }

    if (options.expiry_date_start) {
      query = {
        ...query,
        license_expiry_date: {
          $gte: new Date(options.expiry_date_start),
        },
      };
    }
    if (options.expiry_date_end) {
      query = {
        ...query,
        license_expiry_date: {
          $gte: new Date(options.expiry_date_start),
          $lte: new Date(options.expiry_date_end),
        },
      };
    }
    return query;
  }
}
