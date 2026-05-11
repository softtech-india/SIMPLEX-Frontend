export interface SalesMan {
  id?: number;
  name: string,
  branchid: number,
  addr1: string,
  addr2?: string,
  addr3?: string,
  mobno: string,
  phno: string,
  email: string,
  status: string,

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface SalesManFormData extends Omit<SalesMan, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt' & {}> { }

export interface SalesManApiResponse {
  success: boolean;
  message: string;
  data: SalesMan[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
