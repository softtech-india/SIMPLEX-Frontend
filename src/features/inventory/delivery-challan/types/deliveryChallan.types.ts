export interface DeliveryChallanItem {
  tag?: string;
  dtlid?: number;
  orderdtlid?: number;
  pcategorynm?: string;
  productid: number;
  productnm?: string;
  qty1: number;
  unit?: string;
}

export interface DeliveryChallan {
  id?: number;

  compid?: number;
  branchid?: number;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;

  dcdt?: string;
  dcno?: string;

  customerid: number;
  customernm?: string;

  godownid: number;
  godownnm?: string;

  orderid: number;
  picklistid: number;
  picklistnm: string;

  transportername?: string;
  vehicleno?: string;
  narration?: string;

  qty?: number;
  amt?: number;

  itemdtl: DeliveryChallanItem[];

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface DeliveryChallanFormType
  extends Partial<
    Omit<
      DeliveryChallan,
      "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }

export interface DeliveryChallanApiResponse {
  success: boolean;
  message: string;
  data: DeliveryChallan[];
}

export interface DeliveryChallanItemApiResponse {
  success: boolean;
  message: string;
  data: DeliveryChallanItem[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";