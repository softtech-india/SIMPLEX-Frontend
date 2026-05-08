import { DirectSaleFormSchema } from "../schemas/directSale.schema";

const today = new Date().toISOString().split("T")[0];

export const directSaleFormDefaults: DirectSaleFormSchema = {
  id: 0,

  compid: 0,
  branchid: 0,
  finid: 1,

  vnumid: 0,
  vnummethod: "A",

  billdt: today,
  billno: "",
  billtypeid: 0,

  customerid: 0,
  customernm: "",

  cashcrtype: "",
  crdays: 0,

  saledgerid: 0,
  narration: "",

  qty1: 0,
  qtyrateval: 0,

  discval: 0,
  netval: 0,
  beftaxval: 0,
  taxableval: 0,
  taxval: 0,
  amtwithtaxval: 0,
  afttaxval: 0,
  billamt: 0,

  sgstval: 0,
  cgstval: 0,
  igstval: 0,

  smid: 0,
  godownid: 0,

  billtime: "",

  itemdtl: [
    {
      tag: "I",
      sl: 1,
      dtlid: 1,

      pcategoryid: 0,
      pcategorynm: "",

      productid: 0,
      productnm: "",

      qty1: 0,

      rate: 0,
      value: 0,

      discpct: 0,
      discamt: 0,

      netval: 0,

      taxablerate: 0,
      taxableval: 0,

      taxid: 0,
      taxval: 0,

      finalval: 0,
      stockval: 0,

      cgstpct: 0,
      cgstval: 0,
      cgstledgerid: 0,

      sgstpct: 0,
      sgstval: 0,
      sgstledgerid: 0,

      igstpct: 0,
      igstval: 0,
      igstledgerid: 0,

      hsnid: 0,
      hsnno: "",

      mrp: 0,
    },
  ],

  entryby: 0,
  entrydt: "",
  updateby: 0,
  updatedt: "",
};