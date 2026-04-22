
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { finyearSchema, finyearFormSchema } from "../schemas/finyear.schema";

export const useFinyearForm = (defaultValues?: Partial<finyearFormSchema>) => {
  return useForm<finyearFormSchema>({
    resolver: zodResolver(finyearSchema),
    defaultValues,
    mode: "onChange",
  });
};