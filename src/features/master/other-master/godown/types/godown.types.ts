export interface Godown {
  id: number;
  name: string,
  addr1: string,
  addr2: string,
  addr3: string,
  cityid: number,
  stateid: number,
  pin: string,
  branchid: number

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface Branch {
  id: number;
  name: string;
  printname: string;
  shortname: string;
  code?: string;

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
  ieccode?: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}


export interface GodownFormData extends Omit<Godown, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt' & {}> { }

export interface GodownApiResponse {
  success: boolean;
  message: string;
  data: Godown[];
}


export interface BranchApiResponse {
  success: boolean;
  message: string;
  data: Branch[];

}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
