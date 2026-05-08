import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getDirectSaleSchema,
  DirectSaleFormSchema,
} from "../schemas/directSale.schema";

import { directSaleFormDefaults } from "../constants/directSaleFormDefaults";

export const useDirectSaleForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<DirectSaleFormSchema>
) => {
  const schema = getDirectSaleSchema(isApproveMode);

  return useForm<DirectSaleFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...directSaleFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};