import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GodownSchema, GodownFormSchema } from "../schemas/godown.schema";

export const useProdCategoryForm = (defaultValues?: Partial<GodownFormSchema>) => {
  return useForm<GodownFormSchema>({
    resolver: zodResolver(GodownSchema),
    defaultValues,
    mode: "onChange",
  });
};