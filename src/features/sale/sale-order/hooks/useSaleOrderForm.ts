import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getSaleOrderSchema,
  SaleOrderFormSchema,
} from "../schemas/saleOrder.schema";

import { saleOrderFormDefaults } from "../constants/saleOrderFormDefaults";

export const useSaleOrderForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<SaleOrderFormSchema>
) => {
  const schema = getSaleOrderSchema(isApproveMode);

  return useForm<SaleOrderFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...saleOrderFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};