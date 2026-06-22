import { z } from "zod";

export const VoucherNumberingSchema = z.object({
  name: z.string().min(1, " "),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  maxlength: z
    .number()
    .min(1, " "),
  lastno: z.number().min(0),

  manualallow: z.string().min(1, " "),

  futuredateallow: z.string().min(1, " "),

  status: z.string().min(1, " "),

  voucherid: z.number().min(1, " "),

});

export type VoucherNumberingFormSchema = z.infer<typeof VoucherNumberingSchema>;