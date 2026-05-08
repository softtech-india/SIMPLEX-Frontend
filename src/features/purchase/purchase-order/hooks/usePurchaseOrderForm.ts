import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getPurchaseOrderSchema,
  PurchaseOrderBaseSchema,
  PurchaseOrderFormSchema,
} from "../schemas/purchaseOrder.schema";

import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";

export const usePurchaseOrderForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<PurchaseOrderFormSchema>
) => {
  const schema = getPurchaseOrderSchema(isApproveMode);

  return useForm<PurchaseOrderFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...pruchaseOrderFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};