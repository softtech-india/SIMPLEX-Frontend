import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prodUnitSchema, prodUnitFormSchema } from "../schemas/prodUnit.schema";

export const useProdCategoryForm = (defaultValues?: Partial<prodUnitFormSchema>) => {
  return useForm<prodUnitFormSchema>({
    resolver: zodResolver(prodUnitSchema),
    defaultValues,
    mode: "onChange",
  });
};