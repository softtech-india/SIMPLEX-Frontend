import { z } from "zod";

export const finyearSchema = z.object({
  findesc: z.string().optional(),
    finstdt: z
    .string()
    .min(1, "Financial start date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start date format",
    }),

  finenddt: z
    .string()
    .min(1, "Financial end date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end date format",
    }),
  status: z.string().optional(),
  statusdesc: z.string().optional(),

});



export type finyearFormSchema = z.infer<typeof finyearSchema>;