import { z } from "zod";

export const ProductSchema = z.object({
  productcode: z.string().min(1, "Product code is required"),
  productname: z.string().min(1, "Product name is required"),
  aliasname: z.string().min(1, "Print name is required"),

  productcategoryid: z.number().min(1, "Category is required"),
  productclassid: z.number().min(1, "Class is required"),
  productsubclassid: z.number().min(1, "Subclass is required"),

  unitid: z.number().min(1, "Unit is required"),
  producttype: z.string().min(1, "Product type is required"),

  minimumlevel: z.number().min(0, "Minimum level must be ≥ 0"),
  reorderlevel: z.number().min(0, "Reorder level must be ≥ 0"),

  valuationtype: z.string().min(1, "Valuation type is required"),
  batchrequire: z.string().min(1, "Batch requirement is required"),

  alterunitid: z.number().min(1, "Id type is required"),
  alterunitfactor: z.number().optional(),
  alterunitfactortype: z.string().min(1, "Factor type is required"),
  alterunitmethod: z.string().min(1, "Unit method is required"),

  mrp: z.number().min(0, "MRP must be ≥ 0"),

  hsnid: z.number().min(1, "HSN is required"),
  gstid: z.number().min(1, "GST is required"),

  closedtag: z.string().min(1, "Status is required"),

  purchaserateon: z.number().min(0, "Purchase rate must be ≥ 0"),
  salerateon: z.number().min(0, "Sale rate must be ≥ 0"),
});

export type ProductFormSchema = z.infer<typeof ProductSchema>;