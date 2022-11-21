export class UpdateLicenseDto {
  opportunity_id: string;
  license_type: string;
  license_number: string;
  license_cost: number;
  user: string;
  store: string;
  type_of_operation: string;
  license_effective_date: string
  license_expiry_date: string;
}
