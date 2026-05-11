import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransporterSchema, TransporterFormSchema } from "../schemas/transporter.schema";

export const useProdCategoryForm = (defaultValues?: Partial<TransporterFormSchema>) => {
  return useForm<TransporterFormSchema>({
    resolver: zodResolver(TransporterSchema),
    defaultValues,
    mode: "onChange",
  });
};