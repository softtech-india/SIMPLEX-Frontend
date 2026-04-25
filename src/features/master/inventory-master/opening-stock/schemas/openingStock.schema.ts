import { z } from "zod";

export const OpeningStockItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.coerce.number().optional(),

  godownid: z.coerce.number().min(1, "Please select a godown"),

  qty1: z.coerce.number("Quantity is required").min(1, "Quantity should be greater than 0"),
  qty2: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
});

export const OpeningStockSchema = z.object({
  compid: z.coerce.number().optional(),
  branchid: z.coerce.number().optional(),
  finid: z.coerce.number().optional(),
  productid: z.coerce.number(' This field is required'),


  qty1: z.coerce.number().optional(),
  qty2: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),
  itemdtl: z
    .array(OpeningStockItemSchema)
    .min(1, "At least one item is required"),
});

export type OpeningStockFormSchema = z.output<typeof OpeningStockSchema>;