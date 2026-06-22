import { z } from "zod";

export const HSNSchema = z.object({
  hsn: z.string().min(1, " ").max(8, " "),
  description: z.string().min(1, " "),
  gstid: z.number().min(1, " "),
  type: z.string().min(1, " ")
});

export type HSNFormSchema = z.infer<typeof HSNSchema>;