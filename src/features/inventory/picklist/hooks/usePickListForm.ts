import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getPickListSchema,
  PickListFormSchema,
} from "../schemas/pickList.schema";

import { PickListFormDefaults } from "../constants/pickListFormDefaults";

export const usePickListForm = (
  isApproveMode: boolean,
  defaultValues?: Partial<PickListFormSchema>
) => {
  const schema = getPickListSchema(isApproveMode);

  return useForm<PickListFormSchema>({
    resolver: zodResolver(schema),

    defaultValues: {
      ...PickListFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });
};