export interface BillType {
  id: number;
  name: string,
  type: string,
  accspecify: string,
  accountheadid: number,
  taxregion: string,
  typeoftransaction: string,
  taxapplicable: string,
  istaxinclude: string,
  isdefault: string,
  posapplicable: string,



  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}



export interface BillTypeFormData extends Omit<BillType, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt' & {}> { }

export interface BillTypeApiResponse {
  success: boolean;
  message: string;
  data: BillType[];
}


export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
