import { z } from "zod";

export const RequisitionItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.coerce.number().optional(),
  productid: z.coerce.number().min(1, "Please select a productid"),
  qty: z.coerce
    .number()
    .min(1, "Quantity should be greater than 0"),
});

export const RequisitionSchema = z.object({
  id: z.coerce.number().optional(),

  compid: z.coerce.number().optional(),
  branchid: z.coerce.number().optional(),
  finid: z.coerce.number().optional(),

  vnumid: z.coerce.number("This field is required"),
  vnummethod: z.string("This field is required"),

  reqdt: z.string().optional(),
  reqno: z.string().optional(),

  godownid: z.coerce
    .number()
    .min(1, "Please select a godown"),

  godownName: z.coerce.string().optional(),

  tobranchid: z.coerce
    .number()
    .min(1, "Please select a branch"),

  toBranchName: z.coerce.string().optional(),
  togodownid: z.coerce
    .number()
    .min(1, "Please select a godown"),
  togodownName: z.coerce.string().optional(),

  rem1: z.string().optional(),
  rem2: z.string().optional(),

  totqty: z.coerce.number().optional(),

  itemdtl: z
    .array(RequisitionItemSchema)
    .min(1, "At least one item is required"),

});

export type RequisitionFormSchema = z.output<typeof RequisitionSchema>;