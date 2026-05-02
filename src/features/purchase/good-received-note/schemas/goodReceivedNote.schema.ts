import { z } from "zod";

export const GoodReceivedNoteItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.coerce.number().optional(),

  productid: z.coerce
    .number()
    .min(1, "Please select a product"),

  qty1: z.coerce
    .number()
    .min(1, "Quantity should be greater than 0"),

  qty2: z.coerce.number().optional(),

  rate: z.coerce.number().optional(),
  value: z.coerce.number().optional(),

  altunimethod: z.string().optional(),
  altunitfactor: z.coerce.number().optional(),
  alterunitfactortype: z.string().optional(),

  rateon: z.coerce.number().optional(),

  orderdtlid: z.coerce.number().optional(),

  scanqty: z.number().optional(),
  shortqty: z.number().optional(),
  excessqty: z.number().optional(),
  actualprodval: z.number().optional(),

});

export const GoodReceivedNoteSchema = z.object({
  compid: z.coerce.number().optional(),
  branchid: z.coerce.number().optional(),
  finid: z.coerce.number().optional(),

  vnumid: z.coerce.number().min(1, "This field is required",),

  vnummethod: z.string().min(1, "This field is required"),

  grndt: z.string().optional(),
  grnno: z.string().optional(),

  vendorid: z.coerce
    .number()
    .min(1, "Please select a vendor"),

  partyrefno: z.string().optional(),
  partyrefdt: z.string().optional(),

 // godownid: z.coerce.number().optional(),

  godownid: z.coerce
    .number()
    .min(1, "Please select a Godown"),

  ordertype: z.string().optional(),
  orderid: z.coerce.number().optional(),

  orderno: z.string().optional(),
  orderdt: z.string().optional(),

  narration: z.string().optional(),

  qty1: z.coerce.number().optional(),
  qty2: z.coerce.number().optional(),

  totprodval: z.coerce.number().optional(),

  qrcode: z.string().optional(),
  isconfirm: z.string().optional(),

  itemdtl: z
    .array(GoodReceivedNoteItemSchema)
    .min(1, "At least one item is required"),
});

export const ConfirmGoodReceivedNoteSchema = z.object({
  id: z.number(),
  compid: z.number(),
  qty1: z.number(),
  totprodval: z.number(),

  itemdtl: z.array(
    z.object({
      tag: z.string(),
      dtlid: z.number(),
      productid: z.number(),
      qty1: z.number(),

      scanqty: z.number().optional(),
      shortqty: z.number().optional(),
      excessqty: z.number().optional(),
    })
  ),
});

export type GoodReceivedNoteFormSchema = z.output<typeof GoodReceivedNoteSchema>;
export type ConfirmGoodReceivedNoteFormSchema = z.output<typeof ConfirmGoodReceivedNoteSchema>;