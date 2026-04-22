import { z } from "zod";

export const PurchaseOrderItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),
  productid: z.number().optional(),
  qty1: z.number().optional(),
  qty2: z.number().optional(),
  rate: z.number().optional(),
  value: z.number().optional(),
  altunimethod: z.string().optional(),
  altunitfactor: z.number().optional(),
  alterunitfactortype: z.string().optional(),
  rateon: z.number().optional(),
});

export const PurchaseOrderSchema = z.object({
  compid: z.number().optional(),
  branchid: z.number().optional(),
  finid: z.number().optional(),
  vnumid: z.number().optional(),
  vnummethod: z.string().optional(),

  orderdt: z.string().optional(),
  orderno: z.string().optional(),

  vendorid: z.number().optional(),

  enqno: z.string().optional(),
  enqdt: z.string().optional(),

  quotno: z.string().optional(),
  quotdt: z.string().optional(),

  delvplace: z.string().optional(),
  transportmode: z.string().optional(),

  paymentterms: z.string().optional(),
  paymentmode: z.string().optional(),

  delvdays: z.string().optional(),

  rem1: z.string().optional(),
  rem2: z.string().optional(),

  qty1: z.number().optional(),
  qty2: z.number().optional(),

  totprodval: z.number().optional(),
  afttax: z.number().optional(),
  ordamt: z.number().optional(),

  itemdtl: z.array(PurchaseOrderItemSchema).optional(),
});

export type PurchaseOrderFormSchema = z.infer<typeof PurchaseOrderSchema>;