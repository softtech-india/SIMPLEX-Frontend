import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useProdClass } from "../hooks/prodClass";
import { useCreateProdClass, useUpdateProdClass, useDeleteProdClass } from "../hooks/prodClass";

import { ProdClass, OperationMode, ProdClassFormData } from "../types/prodClass.types";
import { prodClassSchema, prodClassFormSchema } from "../schemas/prodClass.schema";
import { prodClassDefaultValues } from "../constants/prodClassFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";

interface ProdClassFormProps {
  visible: boolean;
  onClose: () => void;
  ProdClassId: number;
  mode: OperationMode;
}

export function ProdClassForm({ visible, onClose, ProdClassId, mode }: ProdClassFormProps) {

  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: prodClasslist, isLoading: isLoadingProdClass } = useProdClass(ProdClassId);
  const createMutation = useCreateProdClass();
  const updateMutation = useUpdateProdClass();
  const deleteMutation = useDeleteProdClass();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<prodClassFormSchema>({
    resolver: zodResolver(prodClassSchema),
    defaultValues: prodClassDefaultValues,
  });

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(prodClassDefaultValues);
      return;
    }

    if (prodClasslist) {
      reset({
        ...prodClasslist,
      });
    }

  }, [prodClasslist, mode, visible, reset, setFocus]);



  // Submit handler
  const handleFormSubmit = async (data: prodClassFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product class",
          message: "Are you sure you want to delete this product class?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(ProdClassId);
        onClose();
        return;
      }

      const payload: ProdClassFormData = {
        ...data,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(prodClassDefaultValues);
       // onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: ProdClassId,
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
      title={`${mode} product class`}
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

          {/* Product Class Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Product Class Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Class Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product class name"
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingProdClass} showIndicator />
      </form>
    </Popup>
  );
}