export interface AccordionProps extends React.HTMLAttributes<Element> {
  children: React.ReactNode;
  // add any custom props, but don't have to specify `children`
}

export interface APIResponseProps {
  locations: LocationsProps[],
  operations: string[],
  revenues: RevenuesProps[],
}

export interface RevenuesProps {
  _id: number;
  revenues: RevenueProps;
  total_revenue: number;
  count: number;
}

export interface RevenueProps {
  _id: string;
  user: string;
  user_store: string;
  type_of_operation: string;
  opportunity_id: string;
  revenue: number;
  revenue_type: number;
  year: number;
}

export interface LocationAddress {
  address: string;
  city: string;
  state: string;
  county: string;
  zip: number;
}

export interface LocationsProps {
  _id: string;
  building: string;
  user: string;
  location: LocationAddress;
  type_of_operation: any[]
}

export interface UpdatedRevenueProps {
  year: number;
  operations: any
}

export interface UpdatedOperationProps {
  _id: string;
  title: string;
  color_code: string;
  total: number;
  convertedTotal: number;
  convertedTotalExt: string;
}

export interface OperationResultsProps {
  title: string;
  color_code: string;
  total: number;
  convertedTotal: number;
  convertedTotalExt: string;
}

export interface APIParamsProps {
  location?: string,
  operation?: string,
  year?: string,
}

export interface LineGrphProps {
  yAxisLabel: string;
  categories: {
    category: {
    label: string
    }[]
  }[],
  results: {
    seriesname: string;
    color: string;
    anchorBgColor: any;
    data: any[],
  }[]
}

export interface LicenseProps {
  _id: string;
  license_type: string;
  license_number: string;
  opportunity_id: string;
  user: string;
  license_cost: number;
  full_address: LocationAddress,
  license_effective_date: string;
  license_expiry_date: string;    
}

export interface LicenseStatProps {
  total: number;
  convertedTotal: number;
  convertedTotalExt: string;
  states: string[];
  items: {
    _id: string;
    title: string;
    color_code: string;
    color_class: string;
    width: string;
    operationKey: string;
    count: number;
    license: LicenseProps[],
  }[]
}

export interface PolicyProps {
  _id: string;
  opportunity_id: string;
  product_id: string;
  premium: number;
  total_premium: number;
  type_of_term: string;
  type_of_operation: string,
  user: string;
  full_address: LocationAddress,
  expiry_date: string;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

export interface PoliciesStatProps {
  total: number;
  convertedTotal: number;
  convertedTotalExt: string;
  states: string[];
  items: {
    _id: string;
    title: string;
    color_code: string;
    color_class: string;
    width: string;
    operationKey: string;
    count: number;
    license: LicenseProps[],
  }[]
}