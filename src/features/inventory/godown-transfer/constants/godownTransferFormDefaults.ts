import { GodownTransferFormSchema } from "../schemas/godownTransfer.schema";

const today = new Date().toISOString().split("T")[0];

export const godownTransferFormDefaults: GodownTransferFormSchema = {
  compid: 0,
  branchid: 0,
  finid: 1,
  vnumid: 0,
  vnummethod: "A",
  reqdt: today,
  gtdt: today,
  reqno: "",
  gtno: "",
  godownid: 0,
  godownnm: "",
  tobranchid: 0,
  tobranchnm: "",
  togodownid: 0,
  togodownnm: "",
  rem: "",
  rem2: "",
  reqid: 0,
  totqty: 0,
  totval: 0,
  itemdtl: [
    {
      tag: "I",
      dtlid: 1,
      pcategoryid: 0,
      pcategorynm: "",
      productid: 0,
      productnm: "",
      qty: 0,
      rate: 0,
      value: 0,
      altunimethod: "",
      altunitfactor: 0,
      alterunitfactortype: "",
      reqdtlid: 0,
    },
  ],
};