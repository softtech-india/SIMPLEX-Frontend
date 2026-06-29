export interface PickListOrderDetail {
  tag?: string;
  dtlid?: number;
  orderid?: number;
  qty?: number;
}

export interface PickListItem {
  dtlid?: number;
  pcategorynm?: string;
  productid?: number;
  productnm?: string;
  qty1?: number;
  unit?: string;
}

export interface PickList {
  id?: number;

  compid?: number;
  branchid?: number;
  finid?: number;
  vnumid?: number;
  vnummethod?: string;

  tbillid?: number[];
  tbillname?: string;

  picklistdt?: string;
  picklistno?: string;

  transportername?: string;
  vehicleno?: string;
  narration?: string;

  qty?: number;

  orderdtl?: PickListOrderDetail[];
  itemdtl?: PickListItem[];

  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface PickListFormType
  extends Partial<
    Omit<
      PickList,
      | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }

export interface PickListApiResponse {
  success: boolean;
  message: string;
  data: PickList[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";