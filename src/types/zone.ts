export interface Country {
    id: number;
    name: string;
    bn_name: string;
    flag_url: string;
    country_code: string;
    is_deleted: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Division {
  id: number
  country_id: number
  name: string
  bn_name: string
  url: string
  is_deleted: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export interface District {
  id: number
  country_id: number
  division_id: number
  division_name: string,
  name: string
  bn_name: string
  url: string
  is_deleted: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export interface Upazilla {
  id: number
  district_id: number
  name: string
  bn_name: string
  url: string
  is_deleted: boolean
  status: string
  createdAt: string
  updatedAt: string
}


export interface Union {
  id: number
  upazilla_id: number
  name: string
  bn_name: string
  url: string
  is_deleted: boolean
  status: string
  createdAt: string
  updatedAt: string
}
