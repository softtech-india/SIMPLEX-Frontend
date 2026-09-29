import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useProdClass } from "../hooks/prodClass";
import { useCreateProdClass, useUpdateProdClass, useDeleteProdClass } from "../hooks/prodClass";
import { OperationMode, ProdClassFormData } from "../types/prodClass.types";
import { prodClassSchema, prodClassFormSchema } from "../schemas/prodClass.schema";
import { prodClassDefaultValues } from "../constants/prodClassFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { Save, XCircle } from "lucide-react";
import Loader from "@/common/components/Loader";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";

interface ProdClassFormProps {
  visible: boolean;
  onClose: () => void;
  ProdClassId: number;
  mode: OperationMode;
  returnAfterSave?: boolean;
  onSuccess?: (product: any) => void;
}

export function ProdClassForm({ visible, onClose, ProdClassId, mode, returnAfterSave, onSuccess }: ProdClassFormProps) {

  const confirm = useConfirm();

  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: prodClasslist, isLoading: isLoadingProdClass } = useProdClass(ProdClassId);
  const createMutation = useCreateProdClass();
  const updateMutation = useUpdateProdClass();
  const deleteMutation = useDeleteProdClass();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const { register, handleSubmit, setFocus, reset, formState: { errors }, } = useForm<prodClassFormSchema>({
    resolver: zodResolver(prodClassSchema),
    defaultValues: prodClassDefaultValues,
  });

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

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

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };


  // Submit handler
  const handleFormSubmit = async (data: prodClassFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product class",
          message: "Are you sure you want to delete this product class?",
          confirmText: "Delete",
          variant: "danger",
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
        const result = await createMutation.mutateAsync(payload);
        reset(prodClassDefaultValues);
        if (returnAfterSave) {
          onSuccess?.(result);
          onClose();
          return;
        }
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
      title={`product class`}
      width="40vw"
      height="auto"
      dragEnabled={false}
      showTitle={false}
      showCloseButton={false}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-1 space-y-1">

          <div className="flex-none border-b rounded border-gray-300 p-2 flex items-center justify-between text-white bg-[#0f1c7f]">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold ">Product Class</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>

          <section className="border rounded-md p-2 shadow-sm bg-white space-y-1">

            <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
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

        {/* Footer */}
        <div className="border-t border-gray-300 px-4 py-2.5 flex justify-end gap-4 bg-white">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={15} /> {isSubmitting ? "Saving..." : getButtonLabel()}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={15} />  Exit
          </button>

        </div>

        {(isSubmitting || isLoadingProdClass) && <Loader />}

      </form>
    </Popup>
  );
}