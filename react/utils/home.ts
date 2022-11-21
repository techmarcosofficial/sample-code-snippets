import { currentDate } from "./datetime";
import { convertNumber, parseNumberExtension } from "./numbers";
import {
  UpdatedRevenueProps,
  UpdatedOperationProps,
} from "../pages/Home/props";

const currentYear = currentDate().getFullYear();

const locationOptions = (locations: any) => {
  const newLocations = locations
    .map((location: any) => {
      return {
        title: location.location.address,
        value: location._id,
      };
    })
    .sort((a: any, b: any) => {
      return a.title > b.title ? 1 : -1; // Sort ASC Order
    });
  // Add element at 0 index.
  newLocations.unshift({ title: "All Locations", value: "" });
  return newLocations;
};

const operationOptions = (operations: any[]) => {
  const newOperations = operations
    .map((operation) => {
      return {
        title: operation.title,
        value: operation._id,
      };
    })
    .sort((a: any, b: any) => {
      return a.title > b.title ? 1 : -1; // Sort ASC Order
    });
  // Add element at 0 index.
  newOperations.unshift({ title: "All Operations", value: "" });
  return newOperations;
};

const revenueDropdownMenuOptions = () => {
  return [{ url: "/", title: "Not decided" }];
};

const complianceDropdownMenuOptions = () => {
  return [{ url: "/renewals", title: "All Licenses" }];
};

const insuranceDropdownMenuOptions = () => {
  return [{ url: "/renewals", title: "All Policies" }];
};

const getLineGraphData = (
  newRevenues: UpdatedRevenueProps[],
  operations: UpdatedOperationProps[]
) => {
  return {
    yAxisLabel: parseNumberExtension(
      operations.sort((obj1, obj2) => {
        return obj1.total > obj2.total ? -1 : 1;
      })[0].convertedTotalExt
    ),
    categories: [
      {
        category: newRevenues.map((revenue: UpdatedRevenueProps) => ({
          label: revenue.year.toString(),
        })),
      },
    ],
    data: operations.map((operation) => {
      return {
        seriesname: operation.title,
        anchorBgColor: operation.color_code,
        color: "#979797",
        data: newRevenues.map((revenue) => {
          const filteredRevenues = revenue.operations.find(
            (item: any) => item._id === operation._id
          );
          if (filteredRevenues) {
            if (revenue.year >= currentYear) {
              return {
                value: filteredRevenues.revenues.reduce((e: any, t: any) => {
                  return (e += t.revenue);
                }, 0),
                dashed: "1",
              };
            }
            return {
              value: filteredRevenues.revenues.reduce((e: any, t: any) => {
                return (e += t.revenue);
              }, 0),
            };
          } else {
            return { value: 0 };
          }
        }),
      };
    }),
  };
};

const getStatsByModule = (name: string, licenses: any, operations: any[]) => {
  let total = 0;
  let states: string[] = [];
  if (name === "license") {
    licenses.forEach((license: any) => {
      total += license.license_cost;
      if (!states.includes(license.store.location.state)) {
        states.push(license.store.location.state);
      }
    });
  } else {
    licenses.forEach((license: any) => {
      total += license.total_premium;
      if (!states.includes(license.store.location.state)) {
        states.push(license.store.location.state);
      }
    });
  }

  const { sum, num, ext } = convertNumber(total);
  return {
    total: sum,
    convertedTotal: num,
    convertedTotalExt: ext,
    states,
    items: operations
      .map((operation: any) => {
        const locations = licenses.filter(
          (license: any) =>
            license.type_of_operation &&
            license.type_of_operation._id === operation._id
        );
        return {
          ...operation,
          states: locations,
          count: locations.length,
        };
      })
      .filter((item) => item.count)
      .sort((a: any, b: any) => {
        return a.count > b.count ? -1 : 1;
      })
      .reduce((e: any, t: any) => {
        if (!e.length) {
          e = [{ ...t, ...{ width: "80%" } }];
          return e;
        }
        if (e[e.length - 1].count > t.count) {
          const percDiff =
            80 *
            Math.abs(
              (e[e.length - 1].count - t.count) /
                ((e[e.length - 1].count + t.count) / 2)
            );
          e = [...e, { ...t, ...{ width: `${percDiff}%` } }];
        } else {
          e = [...e, { ...t, ...{ width: "80%" } }];
        }
        return e;
      }, []),
  };
};

const findUserStoresOperations = (locations: any[]) => {
  return locations
    .reduce((e: any, t: any) => {
      return [...e, ...t.children];
    }, [])
    .reduce((e: any[], t: any) => {
      if (!e.find((item: any) => item._id === t.type_of_operation._id)) {
        e.push(t.type_of_operation);
      }
      return e;
    }, []);
};

const operationConverter = (operations: any[], revenues: any[]) => {
  return operations.map((operation: any) => {
    const n = revenues.map((newRevenue: any) => {
      const revenuesByOperation = newRevenue.revenues.filter(
        (revenue: any) => revenue.type_of_operation === operation._id
      );
      return {
        year: newRevenue._id,
        revenues: revenuesByOperation,
      };
    });

    const total = n.reduce((e: number, t: any) => {
      if (t.revenues.length) {
        return (e += t.revenues.reduce((e: number, t: any) => {
          return (e += t.revenue);
        }, 0));
      } else {
        return (e += 0); // default
      }
    }, 0);
    const { num, ext } = convertNumber(total);
    return {
      ...operation,
      revenues: n,
      total,
      convertedTotal: num,
      convertedTotalExt: ext,
    };
  });
};

export {
  locationOptions,
  operationOptions,
  revenueDropdownMenuOptions,
  complianceDropdownMenuOptions,
  insuranceDropdownMenuOptions,
  getLineGraphData,
  getStatsByModule,
  findUserStoresOperations,
  operationConverter,
};
