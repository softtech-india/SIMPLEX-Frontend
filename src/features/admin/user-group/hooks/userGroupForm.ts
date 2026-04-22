import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userGroupSchema, userGroupFormSchema } from "../schemas/userGroup.schema";
import { userGroupDefaultValues } from "../constants/branchFormDefaults";

// export const useUserGroupForm = (defaultValues?: Partial<userGroupFormSchema>) => {
//   return useForm<userGroupFormSchema>({
//     resolver: zodResolver(userGroupSchema),
//     defaultValues : userGroupDefaultValues,
//     mode: "onChange",
//   });
// };

export const useUserGroupForm = (
  defaultValues?: Partial<userGroupFormSchema>
) => {
  return useForm<userGroupFormSchema>({
    resolver: zodResolver(userGroupSchema),
    defaultValues: {
      ...userGroupDefaultValues,
      ...defaultValues,
    },
    mode: "onChange",
  });
};