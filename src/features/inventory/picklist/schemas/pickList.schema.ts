import { z } from "zod";

export const PickListOrderDetailSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),

  orderid: z.number().min(1, "Please select an order"),
  orderno: z.string().optional(),
});

export const PickListItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),
  pcategorynm: z.string().optional(),
  productid: z.number().min(1, "Please select a product"),
  productnm: z.string().optional(),
  qty: z.number().min(1, "Quantity should be greater than 0"),
  unit: z.string().optional(),
});

export const PickListBaseSchema = z.object({
  compid: z.number().optional(),
  branchid: z.number().optional(),
  finid: z.number().optional(),

  vnumid: z.number().min(1, "This field is required"),
  vnummethod: z.string().min(1, "This field is required"),

  godownid: z.number().min(1, " "),
  godownnm: z.string().optional(),

  tbillid: z.array(z.number()).min(1, "Please select at least one Tbill"),
  tbillname: z.string().optional(),

  picklistdt: z.string().optional(),
  picklistno: z.string().optional(),

  transportername: z.string().optional(),
  vehicleno: z.string().optional(),
  narration: z.string().optional(),

  qty: z.number().optional(),

  orderdtl: z
    .array(PickListOrderDetailSchema).optional(),

  itemdtl: z
    .array(PickListItemSchema)
    .min(1, "At least one item is required"),
});

export const getPickListSchema = (isApproveMode: boolean) =>
  PickListBaseSchema.superRefine((data, ctx) => {
    if (isApproveMode) {

    }
  });

export type PickListFormSchema = z.infer<typeof PickListBaseSchema>;