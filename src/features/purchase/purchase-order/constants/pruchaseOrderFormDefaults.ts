import { PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";

const today = new Date().toISOString().split("T")[0];

export const pruchaseOrderFormDefaults: PurchaseOrderFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,
  vnumid: 0,
  vnummethod: "A",

  orderdt: today,
  orderno: "",

  vendorid: 0,
  vendornm: "",

  enqno: "",
  enqdt: today,

  quotno: "",
  quotdt: today,

  delvplace: "",
  transportmode: "",

  paymentterms: "",
  paymentmode: "",

  delvdays: "",

  rem1: "",
  rem2: "",

  qty1: 0,
  qty2: 0,

  totprodval: 0,
  afttax: 0,
  ordamt: 0,

  aprvstatus: "",
  aprvremarks: "",

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
    },
  ],
};