import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RequisitionSchema,
  RequisitionFormSchema,
} from "../schemas/requisition.schema";
import { requisitionFormDefaults } from "../constants/requisitionFormDefaults";
import { Resolver } from "react-hook-form";

export const useRequisitionForm = (
  defaultValues?: Partial<RequisitionFormSchema>
) => {
  const form = useForm<RequisitionFormSchema>({
    resolver: zodResolver(RequisitionSchema) as Resolver<RequisitionFormSchema>,

    defaultValues: {
      ...requisitionFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });

  return form;
};