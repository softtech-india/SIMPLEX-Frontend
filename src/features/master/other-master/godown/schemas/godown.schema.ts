import { z } from "zod";

export const GodownSchema = z.object({
  name: z.string().min(1, "Name is required"),
  addr1: z.string().min(1, "Address Line 1 is required"),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  cityid: z.number().min(1, "City is required"),
  stateid: z.number().min(1, "State is required"),
  pin: z
    .string()
    .min(1, "PIN is required")
    .regex(/^\d{6}$/, "PIN must be a 6-digit number"),
  branchid: z.number().min(1, "Branch is required")
});

export type GodownFormSchema = z.infer<typeof GodownSchema>;