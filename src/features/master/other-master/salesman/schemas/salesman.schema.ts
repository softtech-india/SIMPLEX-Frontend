import { z } from "zod";

export const SalesManSchema = z.object({
  name: z.string().min(1, "Name is required"),
  branchid: z.number().min(1, "Branch is required"),
  addr1: z.string().min(1, "Address 1 is required"),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  mobno: z.string().min(10, "Mobile number must be at least 10 digits"),
  phno: z.string().optional(),
  email: z.string().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
});

export type SalesManFormSchema = z.infer<typeof SalesManSchema>;