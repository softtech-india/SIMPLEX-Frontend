export interface DeliveryChallanItem {
  tag?: string;
  dtlid?: number;
  orderdtlid?: number;
  pcategorynm?: string;
  productid: number;
  productnm?: string;
  qty1?: number;
  qty: number;
  rate?: number;
  value?: number;
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
  picklistno: string;

  transporterid?: number;
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
  id: string | number;
}

export interface DeliveryChallanItemApiResponse {
  success: boolean;
  message: string;
  data: DeliveryChallanItem[];
  id: string | number
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";