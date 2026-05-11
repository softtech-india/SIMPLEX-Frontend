import { z } from "zod";

export const TransporterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  addr1: z.string().optional(),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  mobno: z.string().optional(),
  phno: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  contperson: z.string().optional(),
  gstin: z.string().optional(),
});

export type TransporterFormSchema = z.infer<typeof TransporterSchema>;