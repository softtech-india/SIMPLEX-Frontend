import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PurchaseOrderSchema, PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";

export const usePurchaseOrderForm = (
  defaultValues?: Partial<PurchaseOrderFormSchema>
) => {
  return useForm<PurchaseOrderFormSchema>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {
      ...pruchaseOrderFormDefaults,
      ...defaultValues,
    },
    mode: "onChange",
  });
};