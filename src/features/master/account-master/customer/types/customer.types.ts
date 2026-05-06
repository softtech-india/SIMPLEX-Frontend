export interface Customer {
  id: number;
  compid: number;
  name: string;
  subledgertypeid: number;
  ledgergroupid: number;
  addr1: string;
  addr2: string;
  addr3: string;
  nl: string;
  cityid?: number;
  stateid: number;
  pin: string;
  phone: string;
  mobile?: string;
  email?: string;
  pan: string;
  crdays: number;
  crlimit: number;
  gstregtype: string;
  gstin: string;
  status: string;
}


export interface SubLedgerType {
  id: number;
  subledgertype: string;
  ledgergroupid: number;
  ledgergroup: string;
  subledgerstatus: string;
  nature: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface CustomerApiResponse {
  success: boolean;
  message: string;
  totalcount: number;
  data: Customer[];
}


export interface SubLedgerApiResponse {
  success: boolean;
  message: string;
  data: SubLedgerType[];
}
export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
