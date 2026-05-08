import { z } from "zod";

export const BillTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  accspecify: z.string().optional(),
  accountheadid: z.number().min(1, "Tax region is required"),
  taxregion: z.string().min(1, "Tax region is required"),
  typeoftransaction: z.string().min(1, "Transaction type is required"),
  taxapplicable: z.string().min(1, "Tax applicable is required"),
  istaxinclude: z.string().min(1, "Tax include is required"),
  isdefault: z.string().min(1, "required"),
  posapplicable: z.string().min(1, "Pos applicable is required"),
  status: z.string().optional()


});

export type BillTypeFormSchema = z.infer<typeof BillTypeSchema>;