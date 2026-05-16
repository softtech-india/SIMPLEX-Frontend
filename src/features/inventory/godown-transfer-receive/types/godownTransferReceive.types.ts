export interface GodownTransferReceiveItem {
  tag?: string;
  sl?: number;
  dtlid?: number;
  pcategoryid?: number;
  pcategorynm?: string;
  productid?: number;
  productnm?: string;
  qty?: number;
  unit?: string;
  rate?: number;
  value?: number;
  reqdtlid?: number;
  balanceqty?: number;
  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;
}

export interface GodownTransferReceive {
  id: number;

  gtno?: string;
  gtdt?: string;
  reqid?: number;
  reqno?: string;
  reqdt?: string;
  godownid?: number;
  godownnm?: string;
  frombranchid?: number;
  frombranchnm?: string;
  fromgodownid?: number;
  fromgodownnm?: string;
  tobranchid?: number;
  tobranchnm?: string;
  togodownid?: number;
  togodownnm?: string;
  rem?: string;
  totqty?: number;
  totval?: number;
  recvstatus?: string;
  recvstatusdesc?: string;
  compid?: number;

  vnumid?: number;
  vnummethod?: string;
  branchid?: number | string;
  finid?: number;
  itemdtl?: GodownTransferReceiveItem[];
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}



export interface GodownTransferReceiveFormType extends Partial<
  Omit<GodownTransferReceive, "entryby" | "entrydt" | "updateby" | "updatedt">
> { }

export type GodownTransfer = GodownTransferReceive;
export type GodownTransferFormType = GodownTransferReceiveFormType;

export interface GodownTransferApiResponse {
  success: boolean;
  message: string;
  data: GodownTransferReceive[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";