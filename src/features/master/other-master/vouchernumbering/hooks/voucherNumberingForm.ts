import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VoucherNumberingSchema, VoucherNumberingFormSchema } from "../schemas/VoucherNumbering";

export const useProdCategoryForm = (defaultValues?: Partial<VoucherNumberingFormSchema>) => {
  return useForm<VoucherNumberingFormSchema>({
    resolver: zodResolver(VoucherNumberingSchema),
    defaultValues,
    mode: "onChange",
  });
};