import { z } from "zod";

export const PurchaseOrderItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.coerce.number().optional(),
  productid: z.coerce.number().optional(),
  qty1: z.coerce.number().optional(),
  qty2: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
  altunimethod: z.string().optional(),
  altunitfactor: z.coerce.number().optional(),
  alterunitfactortype: z.string().optional(),
  rateon: z.coerce.number().optional(),
});

export const PurchaseOrderSchema = z.object({
  compid: z.coerce.number().optional(),
  branchid: z.coerce.number().optional(),
  finid: z.coerce.number().optional(),
  vnumid: z.coerce.number().optional(),
  vnummethod: z.string().optional(),

  orderdt: z.string().optional(),
  orderno: z.string().optional(),

  vendorid: z.coerce.number().optional(),

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

  qty1: z.coerce.number().optional(),
  qty2: z.coerce.number().optional(),

  totprodval: z.coerce.number().optional(),
  afttax: z.coerce.number().optional(),
  ordamt: z.coerce.number().optional(),

  itemdtl: z.array(PurchaseOrderItemSchema).optional(),
});

export type PurchaseOrderFormSchema = z.output<typeof PurchaseOrderSchema>;