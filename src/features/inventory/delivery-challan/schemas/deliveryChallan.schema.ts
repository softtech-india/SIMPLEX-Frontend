import { z } from "zod";

export const DeliveryChallanItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),
  orderdtlid: z.number().optional(),
  pcategorynm: z.string().optional(),
  productid: z.number().min(1, "Please select a product"),
  productnm: z.string().optional(),
  qty: z.number().min(1, "Quantity should be greater than 0"),
  rate: z.number().optional(),
  value: z.number().optional(),
  unit: z.string().optional(),
});

export const DeliveryChallanBaseSchema = z.object({
  compid: z.number().optional(),
  branchid: z.number().optional(),
  finid: z.number().optional(),

  vnumid: z.number().min(1, "This field is required"),
  vnummethod: z.string().min(1, "This field is required"),

  dcdt: z.string().optional(),
  dcno: z.string().optional(),

  customerid: z.number().min(1, "Please select a customer"),
  customernm: z.string().optional(),

  godownid: z.number().min(1, "Please select a godown"),
  godownnm: z.string().optional(),

  orderid: z.number().min(1, "Please select an order"),

  picklistid: z.number().min(1, "Please select a pick list"),
  picklistno: z.string().optional(),

  transporterid: z.number().min(1, "Please select a transporter"),
  transportername: z.string().optional(),
  vehicleno: z.string().optional(),
  narration: z.string().optional(),

  qty: z.number().optional(),
  amt: z.number().optional(),

  itemdtl: z
    .array(DeliveryChallanItemSchema)
    .min(1, "At least one item is required"),
});

export const getDeliveryChallanSchema = (isApproveMode: boolean) =>
  DeliveryChallanBaseSchema.superRefine((data, ctx) => {
    if (isApproveMode) {
      // Add approval-specific validations here if needed.
    }
  });

export type DeliveryChallanFormSchema = z.infer<
  typeof DeliveryChallanBaseSchema
>;