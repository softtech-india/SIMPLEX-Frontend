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

export interface CompanyFormData extends Omit<Company, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface CompanyApiResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
