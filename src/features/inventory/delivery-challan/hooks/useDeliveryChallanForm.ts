import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getDeliveryChallanSchema,
  DeliveryChallanFormSchema,
} from "../schemas/deliveryChallan.schema";

import { DeliveryChallanFormDefaults } from "../constants/deliveryChallanFormDefaults";

export const useDeliveryChallanForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<DeliveryChallanFormSchema>
) => {
  const schema = getDeliveryChallanSchema(isApproveMode);

  return useForm<DeliveryChallanFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...DeliveryChallanFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};