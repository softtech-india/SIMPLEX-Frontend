import { z } from "zod";

export const finyearSchema = z.object({
  findesc: z.string().optional(),
  finstdt: z.string().optional(),
  finenddt: z.string().optional(),
  status: z.string().optional(),
  statusdesc: z.string().optional(),

});

export type finyearFormSchema = z.infer<typeof finyearSchema>;