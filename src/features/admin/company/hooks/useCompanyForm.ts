import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyFormSchema } from "../schemas/company.schema";

export const useCompanyForm = (defaultValues?: Partial<CompanyFormSchema>) => {
  return useForm<CompanyFormSchema>({
    resolver: zodResolver(companySchema),
    defaultValues,
    mode: "onChange",
  });
};