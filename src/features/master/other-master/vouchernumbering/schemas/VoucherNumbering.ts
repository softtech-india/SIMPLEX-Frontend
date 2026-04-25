import { z } from "zod";

export const VoucherNumberingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  maxlength: z
    .number()
    .min(1, "Max length must be at least 1"),
  lastno: z.number().min(0),

  manualallow: z.string().min(1, "Required"),

  futuredateallow: z.string().min(1, "Required"),

  status: z.string().min(1, "Required"),

  voucherid: z.number().min(1, "Voucher is required"),

});

export type VoucherNumberingFormSchema = z.infer<typeof VoucherNumberingSchema>;