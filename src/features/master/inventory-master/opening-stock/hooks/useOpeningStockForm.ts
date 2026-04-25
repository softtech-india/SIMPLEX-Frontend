import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OpeningStockSchema,
  OpeningStockFormSchema,
} from "../schemas/openingStock.schema";
import { openingStockFormDefaults } from "../constants/openingStockFormFormDefaults";
import { Resolver } from "react-hook-form";

export const useOpeningStockForm = (
  defaultValues?: Partial<OpeningStockFormSchema>
) => {
  const form = useForm<OpeningStockFormSchema>({
    resolver: zodResolver(OpeningStockSchema) as Resolver<OpeningStockFormSchema>,

    defaultValues: {
      ...openingStockFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });

  return form;
};