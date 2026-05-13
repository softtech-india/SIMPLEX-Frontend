export interface StockTrial {
  id: number;
  productid: number;
  productnm: string;
  productcode: string;
  opqty: number;
  recvqty: number;
  issuqty: number;
  clqty: number;
  clrate: number;
  clval: number;
  unit: string;
  brandnm: string;
  classnm: string;
  subclassnm: string;
  branchnm?: string;
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface Brand {
  id: number | string;
  name: string;
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface stockTrialApiResponse {
  success: boolean;
  message: string;
  data: StockTrial[];
}

export interface BrandApiResponse {
  success: boolean;
  message: string;
  data: Brand[];
}

export interface StockTrialParams {
  userid: number;
  compid: number;
  branchid?: number;
  printrtval: number;
  strbrand: string;
  finid?: number;
  startdt?: string;
  enddt?: string;
  strclass: string;
  strsubclass: string;
  balancetag: number;
  strgodown: string;
}

export interface StockLedgerTransaction {
  trnid: number;
  trnno: string;
  trndt: string;
  trtype: string;
  refno: string;
  recvqty: number;
  issuqty: number;
  clqty: number;
  clrate: number;
  clval: number;
  unit: string;
}

export interface stockLedgerApiResponse {
  success: boolean;
  message: string;
  data: StockLedgerTransaction[];
}

export interface StockTrialFilterParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  printrtval: number;
  strbrand: string;
  strclass: string;
  strsubclass: string;
  balancetag: number;
  strgodown: string;
}

export interface StockTrialFilterState {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  printrtval: number;
  strbrand: string;
  strclass: string;
  strsubclass: string;
  balancetag: number;
  strgodown: string;
}

// Helper function to format date to "DD/MMM/YYYY" (e.g., "01/Apr/2026") for API
export const formatDateForApi = (date: Date | string | null): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";