import { z } from "zod";

export const HSNSchema = z.object({
  hsn: z.string().min(1, "HSN is required").max(8, "Max 8 characters allowed"),
  description: z.string().min(1, "Description is required"),
  gstid: z.number().min(1, "GST is required"),
  type: z.string().min(1, "Type is required")
});

export type HSNFormSchema = z.infer<typeof HSNSchema>;