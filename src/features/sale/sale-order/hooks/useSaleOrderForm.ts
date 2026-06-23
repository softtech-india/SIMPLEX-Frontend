import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getSaleOrderSchema,
  SaleOrderFormSchema,
} from "../schemas/saleOrder.schema";

import { defaultItemDtl, saleOrderFormDefaults } from "../constants/saleOrderFormDefaults";

export const useSaleOrderForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<SaleOrderFormSchema>
) => {
  const schema = getSaleOrderSchema(isApproveMode);

  return useForm<SaleOrderFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...saleOrderFormDefaults,
      ...defaultValues ,

      itemdtl: defaultValues?.itemdtl?.length ? defaultValues.itemdtl : [defaultItemDtl],
      // itemdtl: defaultValues?.itemdtl ?? [defaultValues],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};