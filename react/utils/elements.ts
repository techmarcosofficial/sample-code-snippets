export interface OptionProps {
  title: string | number;
  value: string | number;
}

export interface DropDownProps {
  name: string;
  selectedItem: string;
  options: OptionProps[];
  onChangeEvent?: (option: any) => void;
}

export interface MangerPops {
  id?: string;
  name: string;
  designation: string;
  phone: string;
}

export interface StoreProps {
  store: {
    id?: string;
    type: string;
    name: string;
    revenue: string;
    revenueUnit: string;
    revenuePastPeriod: string;
    user: MangerPops;
  };
}

export interface DropdownMenuOptions {
  items: {
    title: string;
    url: string;
  }[]
}
