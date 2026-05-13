export interface PurchaseOrder {
  id: number;
  orderno: string;
  orderdt: string;
  trtype: string;
  partynm: string;
  partymobno: string;
  billamt: number;
  netval: number;
  taxableamt: number;
  taxval: number;
  orderstatus: number;
  orderstatusnm: string;
  sm: string;
  brandnm?: string;
  classnm?: string;
  subclassnm?: string;
  productnm?: string;
  qty?: number;
  unitnm?: string;
}

export interface PurchaseOrderApiResponse {
  success: boolean;
  message: string;
  data: PurchaseOrder[];
}

export interface PurchaseOrderParams {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  strbrand: string;
  strclass: string;
  strsubclass: string;
  sortby: number;
  stateid: number;
  partyid: number;
  orderstatus: number;
}

export interface PurchaseOrderFilterState {
  userid: number;
  compid: number;
  branchid: number;
  finid: number;
  startdt: string;
  enddt: string;
  strbrand: string;
  strclass: string;
  strsubclass: string;
  sortby: number;
  stateid: number;
  partyid: number;
  orderstatus: number;
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
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};