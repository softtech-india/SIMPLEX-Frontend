import { DeliveryChallanFormSchema } from "../schemas/deliveryChallan.schema";

const today = new Date().toISOString().split("T")[0];

export const defaultItemDtl = {
  tag: "I",
  dtlid: 1,

  productid: 0,
  productnm: "",

  qty: 0,
  rate: 0,
  value: 0,
};

export const DeliveryChallanFormDefaults: DeliveryChallanFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,

  vnumid: 0,
  vnummethod: "A",

  dcdt: today,
  dcno: "",

  customerid: 0,
  customernm: "",

  godownid: 0,
  godownnm: "",

  orderid: 0,
  picklistid: 0,
  picklistnm: "",

  transportername: "",
  vehicleno: "",
  narration: "",

  qty: 0,
  amt: 0,

  itemdtl: [],
};