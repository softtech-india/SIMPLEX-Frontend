import { z } from "zod";

export const SalesManSchema = z.object({
  name: z.string().min(1, " "),
  branchid: z.number().min(1, " "),
  addr1: z.string().min(1, " "),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  mobno: z.string().min(10, " "),
  phno: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  status: z.string().min(1, " "),
});

export type SalesManFormSchema = z.infer<typeof SalesManSchema>;