import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LedgerSchema, LedgerFormSchema } from "../schemas/ledger.schema";
import { ledgerFormDefaults } from "../constants/ledgerFormDefaults";

export const useLedgerForm = (
  defaultValues?: Partial<LedgerFormSchema>
) => {
  return useForm<LedgerFormSchema>({
    resolver: zodResolver(LedgerSchema),
    defaultValues: {
      ...ledgerFormDefaults,
      ...defaultValues,
    },
    mode: "onChange",
  });
};