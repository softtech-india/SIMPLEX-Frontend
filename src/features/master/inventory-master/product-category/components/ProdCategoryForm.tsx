import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useProdCategory } from "../hooks/prodCategory";
import { useCreateProdCategory, useUpdateProdCategory, useDeleteProdCategory } from "../hooks/prodCategory";
import { OperationMode, ProdCategoryFormData } from "../types/prodCategory.types";
import { prodCategorySchema, prodCategoryFormSchema } from "../schemas/prodCategory.schema";
import { prodCategoryDefaultValues } from "../constants/prodCategoryFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import useUserStore from "@/store/userStore";
import Loader from "@/common/components/Loader";
import { Save, XCircle } from "lucide-react";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";

interface ProdCategoryFormProps {
  visible: boolean;
  onClose: () => void;
  ProdCategoryId: number;
  mode: OperationMode;
  returnAfterSave?: boolean;
  onSuccess?: (product: any) => void;
}

export function ProdCategoryForm({ visible, onClose, ProdCategoryId, mode, returnAfterSave, onSuccess }: ProdCategoryFormProps) {

  const { userId, companyId } = useUserStore();
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

  const { data: prodCategorylist, isLoading: isLoadingProdCategory } = useProdCategory(ProdCategoryId);
  const createMutation = useCreateProdCategory();
  const updateMutation = useUpdateProdCategory();
  const deleteMutation = useDeleteProdCategory();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    register, handleSubmit, setFocus, reset, formState: { errors },
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

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };



  // Submit handler
  const handleFormSubmit = async (data: prodCategoryFormSchema) => {

    if (isDeleteMode) {

      const ok = await confirm({
        title: "Delete product category",
        message: "Are you sure you want to delete this product category?",
        confirmText: "Delete",
        variant: "danger",
      });

      if (!ok) return;

      deleteMutation.mutate(
        {
          id: ProdCategoryId,
          userid: Number(userId),
          compid: Number(companyId),
        },
        {
          onSuccess: (data) => {
            if (!data?.success) {
              return;
            }
            onClose();
          },
        }
      );

      return;
    }

    const payload: ProdCategoryFormData = {
      ...data,
    };

    if (isAddMode) {

      const result = createMutation.mutate(payload, {
        onSuccess: (data) => {
          if (!data?.success) {
            return;
          }
          reset(prodCategoryDefaultValues);
          //onClose();
        },
      });

      if (returnAfterSave) {
        onSuccess?.(result);
        onClose();
        return;
      }

      defaultFocusRef.current?.focus();
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: ProdCategoryId,
          data: payload,
        },
      );
      onClose();
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
      title={`${mode} Product Category`}
      width="40vw"
      height="30vh"
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
              <h1 className="text-base font-semibold ">Product Category</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>

          <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">
            {/* <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Product Category Information
            </h2> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`inputField w-full ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("code")}
                  disabled={isReadOnly}
                  className={`inputField w-full ${errors.code ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter code"
                />
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

        {(isSubmitting || isLoadingProdCategory) && <Loader />}

      </form>

    </Popup>
  );
}