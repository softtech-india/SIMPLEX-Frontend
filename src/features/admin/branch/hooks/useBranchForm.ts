import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema, BranchFormSchema } from "../schemas/branch.schema";

export const useBranchForm = (defaultValues?: Partial<BranchFormSchema>) => {
  return useForm<BranchFormSchema>({
    resolver: zodResolver(branchSchema),
    defaultValues,
    mode: "onChange",
  });
};