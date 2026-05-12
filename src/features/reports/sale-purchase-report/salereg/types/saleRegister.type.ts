export interface SaleRegister {
  id: number;
  billno: string;
  billdt: string;
  trtype: string;

  netval: number;
  beftaxtotal: number;
  taxableamt: number;

  cgstval: number;
  sgstval: number;
  igstval: number;
  taxval: number;

  amtwithtax: number;
  afttaxtotal: number;
  billamt: number;

  partynm: string;
  suptyp: string;
  partymobno: string;

  partyid: number;

  sm: string;

  agbillno: string;
  agbilldt: string;

  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface SaleRegisterApiResponse {
  success: boolean;
  message: string;
  data: SaleRegister[];
}

export interface SaleRegisterParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;

  sortby: number;
  stateid: number;
  trantype: number;
  withProduct?: number;
}

export interface SaleRegisterFilterParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;        // Format: "DD/MMM/YYYY" e.g., "31/Mar/2027"
  printrtval: number;   // 0 or 1
  strbrand: string;     // Can be space separated or comma separated IDs
  strclass: string;
  strsubclass: string;
  balancetag: number;   // 0 = Only Balance, 1 = All
  strgodown: string;
}

export interface SaleRegisterFilterState {
  // Core required params
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;

  sortby: number;
  stateid: number;
  trantype: number;
  withProduct: number;
}


// Helper function to format date to "DD/MMM/YYYY" (e.g., "01/Apr/2026")
export const formatDateForApi = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

// Helper to format date from "DD/MMM/YYYY" to Date object
export const parseDateFromApi = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${month} ${day}, ${year}`);
};



export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";