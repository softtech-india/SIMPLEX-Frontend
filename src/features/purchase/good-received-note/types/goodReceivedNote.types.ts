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

  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;

  rateon?: number;

  orderdtlid?: number;
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

  partyrefno?: string;
  partyrefdt?: string;

  godownid?: number;

  ordertype?: string;
  orderid?: number;

  orderno?: string;
  orderdt?: string;

  narration?: string;

  qty1?: number;
  qty2?: number;

  totprodval?: number;

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

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";