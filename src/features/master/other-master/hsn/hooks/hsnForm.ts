import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HSNSchema, HSNFormSchema } from "../schemas/hsn.schema";

export const useProdCategoryForm = (defaultValues?: Partial<HSNFormSchema>) => {
  return useForm<HSNFormSchema>({
    resolver: zodResolver(HSNSchema),
    defaultValues,
    mode: "onChange",
  });
};