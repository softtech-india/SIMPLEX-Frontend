import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";




import { Resolver } from "react-hook-form";
import { GodownTransferFormSchema, GodownTransferSchema } from "../schemas/godownTransfer.schema";
import { godownTransferFormDefaults } from "../constants/godownTransferFormDefaults";

export const useGodownTransferForm = (
  defaultValues?: Partial<GodownTransferFormSchema>
) => {
  const form = useForm<GodownTransferFormSchema>({
    resolver:
      zodResolver(
        GodownTransferSchema
      ) as Resolver<GodownTransferFormSchema>,

    defaultValues: {
      ...godownTransferFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",

    shouldUnregister: false,
  });

  return form;
};