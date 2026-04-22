import { z } from "zod";

export const prodClassSchema = z.object({
  name: z.string().min(1, "Name is required"),

});

export type prodClassFormSchema = z.infer<typeof prodClassSchema>;