import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LicensesService } from './licenses.service';
import { LicensesController } from './licenses.controller';
import { LicenseResolver } from './graphql/license.resolver';
import { License, LicenseSchema } from './schemas/license.schema';
import { StoresModule } from '../stores/stores.module';
import { TypeOfOperationsModule } from '../type_of_operations/type_of_operations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    StoresModule,
    TypeOfOperationsModule,
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
  ],
  controllers: [LicensesController],
  providers: [LicensesService, LicenseResolver],
  exports: [LicensesService],
})
export class LicensesModule {}
