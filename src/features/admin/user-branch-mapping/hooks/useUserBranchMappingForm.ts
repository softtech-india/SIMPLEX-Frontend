import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userBranchMappingSchema, userBranchMappingFormSchema } from "../schemas/userBranchMapping.schema";
import { userBranchMappingFormDefaults } from "../constants/userBranchMappingFormDefaults";

export const useUserForm = (
  defaultValues?: Partial<userBranchMappingFormSchema>
) => {
  return useForm<userBranchMappingFormSchema>({
    resolver: zodResolver(userBranchMappingSchema),
    defaultValues: {
      ...userBranchMappingFormDefaults,
      ...defaultValues,
    },
    mode: "onChange",
  });
};