export interface Vendor {
  id: number;
  code?: number;
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
  mobile: string;
  email?: string;
  pan: string;
  crdays: number;
  crlimit: number;
  gstregtype: string;
  gstin: string;
  closedtag: string;
  corpgrpid: number;
  intmethod: string;
  intpct: number;
  tdsapplicable: string;
  deducteetype: string;
  tdssecid: number;
  bankbranch: string;
  bankifsc: string;
  banknm: string;
  bankaccno: number | string;
  maintainbillwise: string;
  ismainledger: string;
  accpostledgerid: number;
}

export interface CorpGroup {
  id: number,
  name: string
}
export interface TDS {
  id: number,
  name: string
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

export interface VendorFormData extends Omit<Vendor, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface VendorApiResponse {
  success: boolean;
  message: string;
  totalcount: number;
  data: Vendor[];
}
export interface CorpGroupApiResponse {
  success: boolean;
  message: string;
  data: CorpGroup[];
}
export interface SubLedgerApiResponse {
  success: boolean;
  message: string;
  data: SubLedgerType[];
}
export interface TDSApiResponse {
  success: boolean;
  message: string;
  data: TDS[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
