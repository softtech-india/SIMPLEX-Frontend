export interface PurchaseOrderItem {
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
  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;
  rateon?: number;
}

export interface PurchaseOrder {
  compid?: number | string;
  branchid?: number | string;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;

  orderdt?: string;
  orderno?: string;

  vendorid?: number;
  vendorName?: string;

  enqno?: string;
  enqdt?: string;

  quotno?: string;
  quotdt?: string;

  delvplace?: string;
  transportmode?: string;

  paymentterms?: string;
  paymentmode?: string;

  delvdays?: string;

  rem1?: string;
  rem2?: string;

  qty1?: number;
  qty2?: number;

  totprodval?: number;
  afttax?: number;
  ordamt?: number;

  itemdtl?: PurchaseOrderItem[];

  id?: number;
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface PurchaseOrderFormType
  extends Partial<
    Omit<
      PurchaseOrder,
      "id" | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > {}

export interface PurchaseOrderApiResponse {
  success: boolean;
  message: string;
  data: PurchaseOrder[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";