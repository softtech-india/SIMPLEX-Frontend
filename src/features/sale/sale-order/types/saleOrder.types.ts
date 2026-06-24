export interface SaleOrderItem {
  tag?: string;
  dtlid?: number;
  pcategoryid?: number;
  pcategorynm?: string;
  productid?: number;
  productnm?: string;
  qty1?: number;
  qty2?: number;
  clqty?: number;
  rate?: number;
  value?: number;
  altunimethod?: string;
  altunitfactor?: number;
  alterunitfactortype?: string;
  rateon?: number;
}

export interface SaleOrder {
  id: number;

  compid?: number | string;
  branchid?: number | string;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;

  orderdt?: string;
  orderno?: string;

  customerid?: number;
  customernm?: string;

  godownid: number;
  godownName?: string;
  godownnm?: string;

  partyordno?: string;
  partyorddt?: string;

  rem1?: string;
  rem2?: string;

  qty1?: number;
  qty2?: number;

  totprodval?: number;
  afttax?: number;
  ordamt?: number;

  aprvstatus?: string;
  aprvstatusdesc?: string;
  aprvremarks?: string;

  itemdtl?: SaleOrderItem[];

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface SaleOrderFormType
  extends Partial<
    Omit<
      SaleOrder,
      | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }

export interface SaleOrderApiResponse {
  success: boolean;
  message: string;
  data: SaleOrder[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";