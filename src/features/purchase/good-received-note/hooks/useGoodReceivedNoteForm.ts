import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GoodReceivedNoteSchema,
  GoodReceivedNoteFormSchema,
} from "../schemas/goodReceivedNote.schema";
import { goodReceivedNoteFormDefaults } from "../constants/goodReceivedNoteFormDefaults";
import { Resolver } from "react-hook-form";

export const useGoodReceivedNoteForm = (
  defaultValues?: Partial<GoodReceivedNoteFormSchema>
) => {
  const form = useForm<GoodReceivedNoteFormSchema>({
    resolver: zodResolver(GoodReceivedNoteSchema) as Resolver<GoodReceivedNoteFormSchema>,

    defaultValues: {
      ...goodReceivedNoteFormDefaults,
      ...(defaultValues ?? {}),
      itemdtl: defaultValues?.itemdtl ?? [],
    },

    mode: "onChange",
    shouldUnregister: false,
  });

  return form;
};