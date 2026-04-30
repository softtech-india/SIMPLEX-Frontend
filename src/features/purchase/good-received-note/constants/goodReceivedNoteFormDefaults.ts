import { GoodReceivedNoteFormSchema } from "../schemas/goodReceivedNote.schema";

const today = new Date().toISOString().split("T")[0];

export const goodReceivedNoteFormDefaults: GoodReceivedNoteFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,

  vnumid: 0,
  vnummethod: "A",

  grndt: today,
  grnno: "",

  vendorid: 0,

  partyrefno: "",
  partyrefdt: today,

  godownid: 0,

  ordertype: "",
  orderid: 0,

  orderno: "",
  orderdt: today,

  narration: "",

  qty1: 0,
  qty2: 0,

  totprodval: 0,

  itemdtl: [
    {
      tag: "I",
      dtlid: 1,

      productid: 0,

      qty1: 0,
      qty2: 0,

      rate: 0,
      value: 0,

      altunimethod: "A",
      altunitfactor: 1,
      alterunitfactortype: "M",

      rateon: 1,

      orderdtlid: 0,

      scanqty: 0,
      shortqty: 0,
      excessqty: 0,
      actualprodval: 0,
    },
  ],
};