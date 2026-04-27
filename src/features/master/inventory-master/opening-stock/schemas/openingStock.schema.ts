import { z } from "zod";

export const OpeningStockItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.coerce.number().optional(),

  godownid: z.coerce.number().min(1, "Please select a godown"),
  godownnm: z.string().min(1, "required"),

  qty1: z.coerce.number("Quantity is required").min(1, "Quantity should be greater than 0"),
  qty2: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
});

export const OpeningStockSchema = z.object({
  compid: z.coerce.number().optional(),
  branchid: z.coerce.number().optional(),
  finid: z.coerce.number().optional(),
  productid: z.coerce.number().min(1, ' This field is required'),

  productnm: z.string().optional(),
  productname: z.string().optional(),

  categorynm: z.string().optional(),
  pcategorynm: z.string().optional(),

  // 
  classnm: z.string().optional(),
  unit: z.string().optional(),

  qty1: z.coerce.number().optional(),
  qty2: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
  itemdtl: z
    .array(OpeningStockItemSchema)
    .min(1, "At least one item is required"),
});

export type OpeningStockFormSchema = z.output<typeof OpeningStockSchema>;