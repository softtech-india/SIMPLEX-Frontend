import { DeliveryChallanFormSchema } from "../schemas/deliveryChallan.schema";

const today = new Date().toISOString().split("T")[0];

export const defaultItemDtl = {
  tag: "I",
  dtlid: 1,
  orderdtlid: 0,
  pcategorynm: "",
  productid: 0,
  productnm: "",
  qty1: 0,
  unit: "",

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
  picklistno: "",

  transporterid: 0,
  vehicleno: "",
  narration: "",

  qty: 0,
  amt: 0,

  itemdtl: [],
};