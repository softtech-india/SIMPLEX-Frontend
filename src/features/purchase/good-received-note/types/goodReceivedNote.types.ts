export interface GoodReceivedNoteItem {
  tag?: string;
  dtlid?: number;

  pcategoryid?: number;
  pcategorynm?: string;
  productid?: number;
  productnm?: string;


  qty1?: number;
  qty2?: number;

  rate?: number;
  value?: number;

  unit: string;
  balanceqty1: number;
  confirmqty1: number;

  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;

  rateon?: number;

  orderdtlid?: number;

  scanqty?: number;
  shortqty?: number;
  excessqty?: number;
  actualprodval?: number;

}

export interface GoodReceivedNote {
  id?: number;

  compid?: number | string;
  branchid?: number | string;
  finid?: number;

  vnumid?: number;
  vnummethod?: string;

  grndt?: string;
  grnno?: string;

  vendorid?: number;
  vendorName: string;

  partyrefno?: string;
  partyrefdt?: string;

  godownid?: number;
  godownName?: string;
  
  ordertype?: string;
  orderid?: number;

  orderno?: string;
  orderdt?: string;

  narration?: string;

  qty1?: number;
  qty2?: number;

  totprodval?: number;
  isconfirm?: string;
  isconfirmdesc?: string;

  qrcode?: string;

  itemdtl?: GoodReceivedNoteItem[];

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface GoodReceivedNoteFormType
  extends Partial<
    Omit<
      GoodReceivedNote,
      "id" | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }

export interface GoodReceivedNoteApiResponse {
  success: boolean;
  message: string;
  data: GoodReceivedNote[];
}

// Confirm
export interface ConfirmItems {
  tag: string;
  dtlid: number;
  productid: number;
  qty1: number;
}
export interface ConfirmGrn {
  id: number;
  compid: number;
  qty1: number;
  totprodval: number;
  itemdtl: ConfirmItems[];
}

export interface ConfirmGrnType
  extends Partial<
    Omit<
      ConfirmGrn,
      "id" | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }
export interface ConfirmGRNApiReponse {
  success: boolean;
  message: string;
  data: [];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Confirmed";