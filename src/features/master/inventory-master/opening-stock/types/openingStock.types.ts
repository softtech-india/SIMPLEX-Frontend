export interface OpeningStockItem {
  tag?: string;
  dtlid?: number;
  productid?: number;
  productnm?: string;
  pcategorynm?: string;

  godownid?: number;
  godownnm?: string;

  qty1?: number;
  qty2?: number;
  rate?: number;
  value?: number;
}
// 
export interface OpeningStock {
  id?: number;

  compid?: number | string;
  branchid?: number | string;
  finid?: number;

  pcategoryid? : number;

  productid?: number;

  productnm?: string; 
  productname?: string;

  categorynm?: string;
  pcategorynm?: string;


  classnm?: string;
  unit?: string;

  qty1: number;
  qty2?: number;
  rate?: number;
  value?: number;

  itemdtl?: OpeningStockItem[];


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