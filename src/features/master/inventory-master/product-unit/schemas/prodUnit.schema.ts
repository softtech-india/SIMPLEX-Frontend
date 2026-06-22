import { z } from "zod";

export const prodUnitSchema = z.object({
  name: z.string().min(1, " "),
  description: z.string().min(1, " "),
  decimalplace: z.number().min(0, " "),
  gstunit: z.string().min(1, " ")

});

export type prodUnitFormSchema = z.infer<typeof prodUnitSchema>;