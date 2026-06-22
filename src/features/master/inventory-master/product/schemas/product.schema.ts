import { z } from "zod";

export const ProductSchema = z.object({
  productcode: z.string().optional(),
  productname: z.string().min(1, " "),
  aliasname: z.string().min(1, " "),
  categorynm: z.string().optional(),

  productcategoryid: z.number().min(1, " "),
  productclassid: z.number().min(1, " "),
  productsubclassid: z.number().min(1, " "),

  unitid: z.number().min(1, " "),
  producttype: z.string().min(1, " "),

  minimumlevel: z.number().min(0, " "),
  reorderlevel: z.number().min(0, " "),

  valuationtype: z.string().min(1, " "),
  batchrequire: z.string().min(1, " "),

  alterunitid: z.number().min(1, ""),
  alterunitfactor: z.number().optional(),
  alterunitfactortype: z.string().min(1, " "),
  alterunitmethod: z.string().min(1, " "),

  mrp: z.number().min(0, " "),

  hsnid: z.number().min(1, " "),
  gstid: z.number().min(1, " "),

  closedtag: z.string().min(1, " "),

  purchaserateon: z.number().min(0, " "),
  salerateon: z.number().min(0, " "),
});

export type ProductFormSchema = z.infer<typeof ProductSchema>;