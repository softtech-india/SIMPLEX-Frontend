import { z } from "zod";

export const prodGroupSchema = z.object({
  name: z.string().min(1, " "),

});

export type prodGroupFormSchema = z.infer<typeof prodGroupSchema>;