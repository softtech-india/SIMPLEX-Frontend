import { OpeningStockFormSchema } from "../schemas/openingStock.schema";

const today = new Date().toISOString().split("T")[0];

export const openingStockFormDefaults: OpeningStockFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,
  qty1: 0,
  qty2: 0,
  productid: 0,
  itemdtl: [
    {
      tag: "I",
      dtlid: 1,
      godownid: 0,
      qty1: 0,
      qty2: 0,
      rate: 0,
      value: 0
    },
  ],
};