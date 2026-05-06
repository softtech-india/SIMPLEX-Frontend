export interface RequisitionItem {
  tag?: string;
  dtlid?: number;
  pcategoryid?: number;
  pcategorynm?: string;
  productid?: number;
  productnm?: string;
  qty?: number;
  rate?: number;
  value?: number;
  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;
  rateon?: number;
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
  godownnm?: string;  // Changed from godownName to match API
  tobranchid: number;
  tobranchnm?: string;  // Changed from toBranchName to match API
  togodownid: number;
  togodownnm?: string;  // Changed from togodownName to match API
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

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";