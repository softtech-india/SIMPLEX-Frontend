import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prodClassSchema, prodClassFormSchema } from "../schemas/prodClass.schema";

export const useProdCategoryForm = (defaultValues?: Partial<prodClassFormSchema>) => {
  return useForm<prodClassFormSchema>({
    resolver: zodResolver(prodClassSchema),
    defaultValues,
    mode: "onChange",
  });
};