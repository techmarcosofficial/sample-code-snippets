import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LicensesService } from './licenses.service';
// import { CreateLicenseDto } from './dto/create.license.dto';

class LicenseParams {
  @ApiPropertyOptional()
  opportunity_id?: string;
}

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licenseService: LicensesService) {}

  /**
   * Request: GET
   * Route  : /licenses/sync-licenses
   * Desc   : Return license list by the login user.
   * Params :
   */
  @Get('sync-licenses')
  async syncLicenses(@Query() params: LicenseParams) {
    return await this.licenseService.syncLicenses(params.opportunity_id);
  }

  
  /**
   * Request: GET
   * Route  : /licenses/find-by-params
   * Desc   : Return license list by the params.
   * Params :
   *   - state: return licenses by unique states
   *   - type_of_operation: return licenses by type_of_operation
   *   - expiry date: return licenses that are expired
   
   */
  @Get('/find-by-params')
  @UseGuards(AuthGuard('jwt'))
  find(@Req() req: Request) {
    return this.licenseService.findByParams(req.query, req.user);
  }

}
