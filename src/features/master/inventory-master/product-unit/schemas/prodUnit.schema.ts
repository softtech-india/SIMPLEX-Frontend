import { z } from "zod";

export const prodUnitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  decimalplace: z.number().min(0, "Must be 0 or greater"),
  gstunit: z.string().min(1, "GST unit is required")

});

export type prodUnitFormSchema = z.infer<typeof prodUnitSchema>;