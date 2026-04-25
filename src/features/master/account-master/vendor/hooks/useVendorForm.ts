// hooks/useVendorForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorSchema, VendorFormSchema } from "../schemas/vendor.schema";
import { vendorFormDefaults } from "../constants/vendorFormDefaults";

export const useVendorForm = (
  defaultValues?: Partial<VendorFormSchema>
) => {
  return useForm<VendorFormSchema>({
    resolver: zodResolver(VendorSchema),
    defaultValues: {
      ...vendorFormDefaults,
      ...defaultValues,
    },
    mode: "onChange",
  });
};