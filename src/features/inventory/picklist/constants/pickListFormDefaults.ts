import { PickListFormSchema } from "../schemas/pickList.schema";

const today = new Date().toISOString().split("T")[0];

export const defaultOrderDtl = {
  tag: "I",
  dtlid: 1,
  orderid: 0,
  qty: 0,
};

export const defaultItemDtl = {
  tag: "I",
  dtlid: 1,
  productid: 0,
  qty: 0,
};

export const PickListFormDefaults: PickListFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,

  vnumid: 0,
  vnummethod: "A",

  tbillid: [],
  tbillname: '',

  picklistdt: today,
  picklistno: "",

  transportername: "",
  vehicleno: "",
  narration: "",

  qty: 0,

  orderdtl: [],

  itemdtl: [],
};