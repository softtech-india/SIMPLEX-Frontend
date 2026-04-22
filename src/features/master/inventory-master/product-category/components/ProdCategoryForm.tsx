import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useProdCategory } from "../hooks/prodCategory";
import { useCreateProdCategory, useUpdateProdCategory, useDeleteProdCategory } from "../hooks/prodCategory";

import { ProdCategory, OperationMode, ProdCategoryFormData } from "../types/prodCategory.types";
import { prodCategorySchema, prodCategoryFormSchema } from "../schemas/prodCategory.schema";
import { prodCategoryDefaultValues } from "../constants/prodCategoryFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";

interface ProdCategoryFormProps {
  visible: boolean;
  onClose: () => void;
  ProdCategoryId: number;
  mode: OperationMode;
}

export function ProdCategoryForm({ visible, onClose, ProdCategoryId, mode }: ProdCategoryFormProps) {

  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: prodCategorylist, isLoading: isLoadingProdCategory } = useProdCategory(ProdCategoryId);
  const createMutation = useCreateProdCategory();
  const updateMutation = useUpdateProdCategory();
  const deleteMutation = useDeleteProdCategory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<prodCategoryFormSchema>({
    resolver: zodResolver(prodCategorySchema),
    defaultValues: prodCategoryDefaultValues,
  });

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(prodCategoryDefaultValues);
      return;
    }

    if (prodCategorylist) {
      reset({
        ...prodCategorylist,
      });
    }

  }, [prodCategorylist, mode, visible, reset, setFocus]);



  // Submit handler
  const handleFormSubmit = async (data: prodCategoryFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product category",
          message: "Are you sure you want to delete this product category?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(ProdCategoryId);
        onClose();
        return;
      }

      const payload: ProdCategoryFormData = {
        ...data,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset({});
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: ProdCategoryId,
          data: payload,
        });
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} product category`}
      width="40vw"
      height="auto"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Product Category Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Product Category Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Category Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product category name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>


            </div>
          </section>


        </div>

        {/* Footer delete-btn */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? isDeleteMode ? "Deleting..." : "Saving..."
                : isDeleteMode ? "Delete" : "Save"
              }
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit
          </button>
        </div>

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingProdCategory} showIndicator />
      </form>
    </Popup>
  );
}