import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalesManSchema, SalesManFormSchema } from "../schemas/salesman.schema";

export const useProdCategoryForm = (defaultValues?: Partial<SalesManFormSchema>) => {
  return useForm<SalesManFormSchema>({
    resolver: zodResolver(SalesManSchema),
    defaultValues,
    mode: "onChange",
  });
};