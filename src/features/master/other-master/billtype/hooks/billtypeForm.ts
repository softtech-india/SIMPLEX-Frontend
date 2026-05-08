import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillTypeSchema, BillTypeFormSchema } from "../schemas/billtype.schema";

export const useProdCategoryForm = (defaultValues?: Partial<BillTypeFormSchema>) => {
  return useForm<BillTypeFormSchema>({
    resolver: zodResolver(BillTypeSchema),
    defaultValues,
    mode: "onChange",
  });
};