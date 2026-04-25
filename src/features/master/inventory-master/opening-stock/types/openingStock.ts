export interface OpeningStockItem {
  tag?: string;
  dtlid?: number;
  godownid: number;
  qty1?: number;
  qty2?: number;
  rate?: number;
  value?: number;
}

export interface OpeningStock {
  compid?: number | string;
  branchid?: number | string;
  finid?: number;
  productid: number;
  qty1: number;
  qty2: number;
  rate?: number;
  value?: number;
  orderdt?: string;
  orderno?: string;

  itemdtl?: OpeningStockItem[];

  id?: number;
  entryby?: number;
  entrydt?: string;
  updateby?: number;
  updatedt?: string;
}

export interface OpeningStockFormType
  extends Partial<
    Omit<
      OpeningStock,
      "id" | "entryby" | "entrydt" | "updateby" | "updatedt"
    >
  > { }

export interface OpeningStockApiResponse {
  success: boolean;
  message: string;
  data: OpeningStock[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print";