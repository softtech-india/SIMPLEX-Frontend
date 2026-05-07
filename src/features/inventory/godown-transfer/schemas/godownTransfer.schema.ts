import { z } from "zod";

export const GodownTransferItemSchema = z.object({
  tag: z.string().optional(),

  dtlid: z.coerce.number().optional(),

  pcategoryid: z.coerce.number().optional(),
  pcategorynm: z.string().optional(),

  productid: z.coerce
    .number()
    .min(1, "Please select a product"),

  productnm: z.string().optional(),

  qty: z.coerce
    .number()
    .min(1, "Quantity should be greater than 0"),

  rate: z.coerce.number().optional(),

  value: z.coerce.number().optional(),

  altunimethod: z.string().optional(),

  altunitfactor: z.coerce.number().optional(),

  alterunitfactortype: z.string().optional(),

  reqdtlid: z.coerce.number().optional(),
});

export const GodownTransferSchema = z.object({
  id: z.coerce.number().optional(),

  compid: z.coerce.number().optional(),

  branchid: z.coerce.number().optional(),

  finid: z.coerce.number().optional(),

  vnumid: z.coerce
    .number()
    .min(1, "Voucher number is required"),

  vnummethod: z.string().optional(),

  reqdt: z.string().optional(),

  gtdt: z.string().optional(),

  reqno: z.number().optional(),
  reqName: z.string().optional(),

  gtno: z.string().optional(),

  godownid: z.coerce
    .number()
    .min(1, "Please select a godown"),

  godownnm: z.string().optional(),
  godownName: z.string().optional(),

  tobranchid: z.coerce
    .number()
    .min(1, "Please select a branch"),

  tobranchnm: z.string().optional(),
  toBranchName: z.string().optional(),

  togodownid: z.coerce
    .number()
    .min(1, "Please select a godown"),

  togodownnm: z.string().optional(),
  togodownName: z.string().optional(),

  rem: z.string().optional(),

  rem2: z.string().optional(),

  reqid: z.coerce.number().optional(),

  totqty: z.coerce.number().optional(),

  totval: z.coerce.number().optional(),

  itemdtl: z
    .array(GodownTransferItemSchema)
    .min(1, "At least one item is required"),

  entryby: z.coerce.number().optional(),

  entrydt: z.string().optional(),

  updateby: z.coerce.number().optional(),

  updatedt: z.string().optional(),
});

export type GodownTransferFormSchema = z.output<
  typeof GodownTransferSchema
>;