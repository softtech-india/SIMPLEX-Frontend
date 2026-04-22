import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, ProductFormSchema } from "../schemas/product.schema";

export const useProdCategoryForm = (defaultValues?: Partial<ProductFormSchema>) => {
  return useForm<ProductFormSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
    mode: "onChange",
  });
};