import { z } from "zod";

export const BillTypeSchema = z.object({
  name: z.string().min(1, " "),
  type: z.string().min(1, " "),
  accspecify: z.string().optional(),
  accountheadid: z.number().min(1, " "),
  taxregion: z.string().min(1, " "),
  typeoftransaction: z.string().min(1, " "),
  taxapplicable: z.string().min(1, " "),
  istaxinclude: z.string().min(1, " "),
  isdefault: z.string().min(1, " "),
  posapplicable: z.string().min(1, " "),
  status: z.string().optional()


});

export type BillTypeFormSchema = z.infer<typeof BillTypeSchema>;