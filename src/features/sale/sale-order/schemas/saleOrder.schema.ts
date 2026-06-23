import { z } from "zod";

export const SaleOrderItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),

  productid: z.number().min(1, "Please select a product"),

  qty1: z.number().min(1, "Quantity should be greater than 0"),
  qty2: z.number().optional(),

  rate: z.number().optional(),
  value: z.number().optional(),

  altunimethod: z.string().optional(),
  pcategoryid: z.number().optional(),
  altunitfactor: z.number().optional(),
  alterunitfactortype: z.string().optional(),
  rateon: z.number().optional(),
});

export const SaleOrderBaseSchema = z.object({
  compid: z.number().optional(),
  branchid: z.number().optional(),
  finid: z.number().optional(),

  vnumid: z.number().min(1, "This field is required"),
  vnummethod: z.string().min(1, "This field is required"),

  orderdt: z.string().optional(),
  orderno: z.string().optional(),

  customerid: z.number().min(1, "Please select a customer"),
  customernm: z.string().optional(),

  godownid: z.number().min(1, "Please select a godown"),
  godownName: z.string().optional(),
  godownnm: z.string().optional(),

  partyordno: z.string().optional(),
  partyorddt: z.string().optional(),

  rem1: z.string().optional(),
  rem2: z.string().optional(),

  qty1: z.number().optional(),
  qty2: z.number().optional(),

  totprodval: z.number().optional(),
  afttax: z.number().optional(),
  ordamt: z.number().optional(),

  aprvstatus: z.string().optional(),
  aprvremarks: z.string().optional(),
  qrcode: z.string().optional(),

  itemdtl: z.array(SaleOrderItemSchema).min(1, "At least one item is required"),
});

export const getSaleOrderSchema = (isApproveMode: boolean) =>
  SaleOrderBaseSchema.superRefine((data, ctx) => {
    if (isApproveMode) {
      if (!data.aprvstatus?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["aprvstatus"],
          message: "Please select approval status",
        });
      }

      if (!data.aprvremarks?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["aprvremarks"],
          message: "This field is required",
        });
      }
    }
  });

export type SaleOrderFormSchema =
  z.infer<typeof SaleOrderBaseSchema>;