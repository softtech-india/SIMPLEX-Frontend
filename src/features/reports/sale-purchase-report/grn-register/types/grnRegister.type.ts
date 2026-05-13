export interface GRN {
  id: number;
  grnno: string;
  grndt: string | null;
  vendornm: string;
  partyrefno: string;
  partyrefdt: string | null;
  totqty: string;
  totvalue: string;
  brandnm: string;
  classnm: string;
  subclassnm: string;
  unitnm: string;
  productnm: string;
  qty: number;
  rate: number;
  value: number;
}

export interface GRNApiResponse {
  success: boolean;
  message: string;
  data: GRN[];
}

export interface GRNParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  strbrand: string;
  strclass: string;
  strparty: string;
  stateid: number;
}

export interface GRNFilterState {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  strbrand: string;
  strclass: string;
  strparty: string;
  stateid: number;
}

export interface Vendor {
  id: number;
  code: string;
  name: string;
  mobile: string;
  stateid: number;
  gstin: string;
  email: string;
  subledgertypenm?: string;
  ledgergroupnm?: string;
  addr?: string;
  cityid?: number;
  pin?: string;
  phone?: string;
  pan?: string;
  gstregtype?: string;
  gstregtypedesc?: string;
  status?: string;
  statusdesc?: string;
  crdays?: number;
  crlimit?: number;
  tcsapplicable?: string;
  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface VendorApiResponse {
  success: boolean;
  message: string;
  totalcount: number;
  data: Vendor[];
}

export const formatDateForApi = (date: Date | string | null): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};