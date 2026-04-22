import { z } from "zod";

export const prodCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),

});

export type prodCategoryFormSchema = z.infer<typeof prodCategorySchema>;