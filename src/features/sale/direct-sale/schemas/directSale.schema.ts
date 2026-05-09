import { z } from "zod";

export const DirectSaleItemSchema = z.object({
  tag: z.string().optional(),
  sl: z.number().optional(),
  dtlid: z.number().optional(),

  pcategoryid: z.number().optional(),
  pcategorynm: z.string().optional(),

  productid: z.number().min(1, "Please select a product"),
  productnm: z.string().optional(),

  qty1: z.number().min(1, "Quantity should be greater than 0"),

  rate: z.number().optional(),
  value: z.number().optional(),

  discpct: z.number().optional(),
  discamt: z.number().optional(),

  netval: z.number().optional(),

  taxablerate: z.number().optional(),
  taxableval: z.number().optional(),

  taxid: z.number().optional(),
  taxval: z.number().optional(),

  finalval: z.number().optional(),
  stockval: z.number().optional(),

  cgstpct: z.number().optional(),
  cgstval: z.number().optional(),
  cgstledgerid: z.number().optional(),

  sgstpct: z.number().optional(),
  sgstval: z.number().optional(),
  sgstledgerid: z.number().optional(),

  igstpct: z.number().optional(),
  igstval: z.number().optional(),
  igstledgerid: z.number().optional(),

  hsnid: z.number().optional(),
  hsnno: z.string().optional(),

  mrp: z.number().optional(),
});

export const DirectSaleBaseSchema = z.object({
  id: z.number().optional(),

  compid: z.union([z.number(), z.string()]).optional(),
  branchid: z.union([z.number(), z.string()]).optional(),

  finid: z.number().optional(),

  vnumid: z.number().min(1, "This field is required"),
  vnummethod: z.string().min(1, "This field is required"),

  billdt: z.string().optional(),
  billno: z.string().optional(),

  billtypeid: z.number().min(1, "Please select a bill type"),
  billTypename: z.string().optional(),

  customerid: z.number().min(1, "Please select a customer"),
  customernm: z.string().optional(),

  cashcrtype: z.string().optional(),
  crdays: z.number().optional(),

  narration: z.string().optional(),

  qty1: z.number().optional(),
  qtyrateval: z.number().optional(),

  discval: z.number().optional(),
  netval: z.number().optional(),
  beftaxval: z.number().optional(),
  taxableval: z.number().optional(),
  taxval: z.number().optional(),
  amtwithtaxval: z.number().optional(),
  afttaxval: z.number().optional(),
  billamt: z.number().optional(),

  sgstval: z.number().optional(),
  cgstval: z.number().optional(),
  igstval: z.number().optional(),

  smid: z.number().min(1, "Please select a saleman"),
  salemanName: z.string().optional(),

  godownid: z.number().min(1, "Please select a godown"),
  godownName: z.string().optional(),

  saledgerid: z.number().min(1, "Please select a sale ledger"),
  saleledgerName: z.string().optional(),

  billtime: z.string().optional(),

  qrcode:  z.string().optional(),

  itemdtl: z.array(DirectSaleItemSchema).min(1, "At least one item is required"),

});

export const getDirectSaleSchema = (isApproveMode: boolean) =>
  DirectSaleBaseSchema.superRefine((data, ctx) => {
    if (isApproveMode) {
      // add approve validations here if needed
    }
  });

export type DirectSaleFormSchema = z.infer<typeof DirectSaleBaseSchema>;