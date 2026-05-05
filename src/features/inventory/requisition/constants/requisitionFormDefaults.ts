import { RequisitionFormSchema } from "../schemas/requisition.schema";

const today = new Date().toISOString().split("T")[0];

export const requisitionFormDefaults: RequisitionFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,
  vnumid: 0,
  vnummethod: "A",
  reqdt: '',
  reqno: '',
  godownid: 0,
  tobranchid: 0,
  togodownid: 0,
  rem1: '',
  rem2: '',
  totqty: 0,

  itemdtl: [
    {
      tag: "I",
      dtlid: 1,
      pcategoryid: 0,
      pcategorynm: '',
      qty: 0
    },
  ],
};