// hooks/useCustomerForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerSchema, CustomerFormSchema } from "../schemas/customer.schema";
import { customerFormDefaults } from "../constants/customerFormDefaults";

export const useCustomerForm = (
  defaultValues?: Partial<CustomerFormSchema>
) => {
  return useForm<CustomerFormSchema>({
    resolver: zodResolver(CustomerSchema),
    defaultValues: {
      ...customerFormDefaults,
      ...defaultValues,
    },
    mode: "onChange",
  });
};