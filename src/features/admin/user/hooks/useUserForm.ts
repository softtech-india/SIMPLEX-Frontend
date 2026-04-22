import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, userFormSchema } from "../schemas/user.schema";
import { userDefaultValues } from "../constants/userFormDefaults";

export const useUserForm = (
  defaultValues?: Partial<userFormSchema>
) => {
  return useForm<userFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      ...userDefaultValues,
      ...defaultValues,
    },
    mode: "onChange",
  });
};