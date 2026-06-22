import { OpeningStockFormSchema } from "../schemas/openingStock.schema";

export const defaultItemDtl = {
  tag: "I",
  dtlid: 1,
  godownid: 0,
  godownnm: '',
  qty1: 0,
  qty2: 0,
  rate: 0,
  value: 0
}

export const openingStockFormDefaults: OpeningStockFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,

  productid: 0,

  qty1: 0,
  qty2: 0,
  rate: 0,
  value: 0,

  itemdtl: [
    {
      tag: "I",
      dtlid: 1,
      godownid: 0,
      godownnm: '',
      qty1: 0,
      qty2: 0,
      rate: 0,
      value: 0
    },
  ],
};