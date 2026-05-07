export interface GodownTransferItem {
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
  reqdtlid?: number;
}

export interface GodownTransfer {
  id: number;
  compid?: number | string;
  branchid?: number | string;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;
  reqdt?: string;
  gtdt?: string;
  reqno?: number;
  gtno?: string;
  godownid: number;
  godownnm?: string;
  tobranchid: number;
  tobranchnm?: string;
  togodownid: number;
  togodownnm?: string;
  rem?: string;
  rem2?: string;
  reqid?: number;
  totqty?: number;
  totval?: number;
  itemdtl?: GodownTransferItem[];
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}



export interface GodownTransferFormType extends Partial<
  Omit<GodownTransfer, "entryby" | "entrydt" | "updateby" | "updatedt">
> { }

export interface GodownTransferApiResponse {
  success: boolean;
  message: string;
  data: GodownTransfer[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";