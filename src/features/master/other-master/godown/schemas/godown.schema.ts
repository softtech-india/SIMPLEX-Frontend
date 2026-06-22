import { z } from "zod";

export const GodownSchema = z.object({
  name: z.string().min(1, " "),
  addr1: z.string().min(1, " "),
  addr2: z.string().optional(),
  addr3: z.string().optional(),
  cityid: z.number().min(1, " "),
  stateid: z.number().min(1, " "),
  pin: z
    .string()
    .min(1, " ")
    .regex(/^\d{6}$/, " "),
  branchid: z.number().min(1, " ")
});

export type GodownFormSchema = z.infer<typeof GodownSchema>;