import { z } from "zod";

export const prodCategorySchema = z.object({
  name: z.string().min(1, " "),

});

export type prodCategoryFormSchema = z.infer<typeof prodCategorySchema>;