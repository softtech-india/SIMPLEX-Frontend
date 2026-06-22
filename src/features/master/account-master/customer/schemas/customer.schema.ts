// schemas/customer.schema.ts
import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, " "),
  subledgertypeid: z.number(),
  ledgergroupid: z.number().min(1, " "),
  cityid: z.number(" ").min(1, " "),
  stateid: z.number().min(1, " "),
  addr1: z.string().min(1, " "),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  nl: z.string().optional(),
  pin: z
    .string()
    .regex(/^\d+$/, " ")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  mobile: z
    .string()
    .regex(/^\d+$/, " ")
    .or(z.literal(""))
    .optional(),
  email: z.string().optional(),
  pan: z.string().optional(),
  crdays: z.number().optional(),
  crlimit: z.number().optional(),
  gstregtype: z.string().optional(),
  gstin: z.string().optional(),
  status: z.string().optional(),
});

export type CustomerFormSchema = z.infer<typeof CustomerSchema>;