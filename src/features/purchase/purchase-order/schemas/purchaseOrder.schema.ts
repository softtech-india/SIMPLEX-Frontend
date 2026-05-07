import { z } from "zod";

export const PurchaseOrderItemSchema = z.object({
  tag: z.string().optional(),
  dtlid: z.number().optional(),

  productid: z.number().min(1, "Please select a product"),

  qty1: z.number().min(1, "Quantity should be greater than 0"),
  qty2: z.number().optional(),
  
  rate: z.number().optional(),
  value: z.number().optional(),

  altunimethod: z.string().optional(),
  altunitfactor: z.number().optional(),
  alterunitfactortype: z.string().optional(),
  rateon: z.number().optional(),
});

export const PurchaseOrderBaseSchema = z.object({
  compid: z.number().optional(),
  branchid: z.number().optional(),
  finid: z.number().optional(),

  vnumid: z.number().min(1, "This field is required"),
  vnummethod: z.string().min(1, "This field is required"),

  orderdt: z.string().optional(),
  orderno: z.string().optional(),

  vendorid: z.number().min(1, "Please select a vendor"),
  vendornm: z.string().optional(),
  vendorName: z.string().optional(),

  enqno: z.string().optional(),
  enqdt: z.string().optional(),

  quotno: z.string().optional(),
  quotdt: z.string().optional(),

  delvplace: z.string().optional(),
  transportmode: z.string().optional(),

  paymentterms: z.string().optional(),
  paymentmode: z.string().optional(),

  delvdays: z.string().optional(),

  rem1: z.string().optional(),
  rem2: z.string().optional(),

  qty1: z.number().optional(),
  qty2: z.number().optional(),

  totprodval: z.number().optional(),
  afttax: z.number().optional(),
  ordamt: z.number().optional(),

  aprvstatus: z.string().optional(),
  aprvremarks: z.string().optional(),

  itemdtl: z.array(PurchaseOrderItemSchema).min(1, "At least one item is required"),
});

export const getPurchaseOrderSchema = (isApproveMode: boolean) =>
  PurchaseOrderBaseSchema.superRefine((data, ctx) => {
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

export type PurchaseOrderFormSchema =
  z.infer<typeof PurchaseOrderBaseSchema>;