
export interface Company {
  id: number;
  name: string;
  printname: string;
  shortname: string;
  nature: string;
  status: string;
  add1: string;
  add2?: string;
  add3?: string;
  add4?: string;
  stateId: number;
  cityId: number;
  pin?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstin?: string;
  cin?: string;
  pan: string;
  tan?: string;
  ieccode?: string;
  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface FinYear {
  id: number;
  findesc: string;
  finstdt: string;
  finenddt: string;
  status: string;
  statusdesc: string;
}

export interface CompanyApiResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export interface CompFinyearMappingApiResponse {
  success: boolean;
  message: string;
  mapped: FinYear[];
  unMapped: FinYear[];
}

export interface CreateMappingInput {
  companyId: number;
  finid: number;
};

export interface CompFinyearMappingState {
  mapped: FinYear[];
  unMapped: FinYear[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';