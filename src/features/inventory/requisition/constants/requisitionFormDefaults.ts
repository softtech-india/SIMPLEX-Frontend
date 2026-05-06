import { RequisitionFormSchema } from "../schemas/requisition.schema";

const today = new Date().toISOString().split("T")[0];

export const requisitionFormDefaults: RequisitionFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,
  vnumid: 0,
  vnummethod: "A",
  reqdt: today,
  reqno: '',
  godownid: 0,
  godownName: '',
  tobranchid: 0,
  toBranchName: '',
  togodownid: 0,
  togodownName: '',
  rem1: '',
  rem2: '',
  totqty: 0,

  itemdtl: [
    {
      tag: "I",
      dtlid: 1,
      productid: 0,
      qty: 0
    },
  ],
};