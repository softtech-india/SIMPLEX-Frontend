import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PurchaseOrderSchema,
  PurchaseOrderFormSchema,
} from "../schemas/purchaseOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";
import { Resolver } from "react-hook-form";

export const usePurchaseOrderForm = (
  defaultValues?: Partial<PurchaseOrderFormSchema>
) => {
  const form = useForm<PurchaseOrderFormSchema>({
    resolver: zodResolver(PurchaseOrderSchema) as Resolver<PurchaseOrderFormSchema>,

    defaultValues: {
      ...pruchaseOrderFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });

  return form;
};