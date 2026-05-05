export interface RequisitionItem {
  tag?: string;
  dtlid?: number;
  pcategoryid?: number;
  pcategorynm?: string;
  qty?: number;
}

export interface Requisition {
  id: number;
  compid?: number | string;
  branchid?: number | string;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;
  reqdt?: string;
  reqno?: string;
  godownid: number;
  tobranchid: number;
  togodownid: number;
  rem1?: string;
  rem2?: string;
  totqty?: number;
  itemdtl?: RequisitionItem[];
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface RequisitionFormType extends Partial<
  Omit<Requisition, "entryby" | "entrydt" | "updateby" | "updatedt">
> { }

export interface RequisitionApiResponse {
  success: boolean;
  message: string;
  data: Requisition[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";