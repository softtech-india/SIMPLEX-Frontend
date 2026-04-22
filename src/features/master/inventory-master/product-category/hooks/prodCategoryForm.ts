import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prodCategorySchema, prodCategoryFormSchema } from "../schemas/prodCategory.schema";

export const useProdCategoryForm = (defaultValues?: Partial<prodCategoryFormSchema>) => {
  return useForm<prodCategoryFormSchema>({
    resolver: zodResolver(prodCategorySchema),
    defaultValues,
    mode: "onChange",
  });
};