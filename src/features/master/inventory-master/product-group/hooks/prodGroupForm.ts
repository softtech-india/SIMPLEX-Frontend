import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prodGroupSchema, prodGroupFormSchema } from "../schemas/prodGroup.schema";

export const useProdCategoryForm = (defaultValues?: Partial<prodGroupFormSchema>) => {
  return useForm<prodGroupFormSchema>({
    resolver: zodResolver(prodGroupSchema),
    defaultValues,
    mode: "onChange",
  });
};