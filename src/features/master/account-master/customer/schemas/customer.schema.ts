// schemas/customer.schema.ts
import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Customer name is required"),
  subledgertypeid: z.number(),
  ledgergroupid: z.number().min(1, "Ledger group is required"),
  cityid: z.number("City is required").min(1, "City is required"),
  stateid: z.number().min(1, "State is required"),
  addr1: z.string().min(1, "Address is required"),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  nl: z.string().optional(),
  pin: z
    .string()
    .regex(/^\d+$/, "PIN must contain only numbers")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  mobile: z
    .string()
    .regex(/^\d+$/, "Mobile must contain only numbers")
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