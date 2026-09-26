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
      height="auto"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit(handleFormSubmit, onError)} className="flex flex-col h-full" >
        <div className="flex-1 overflow-y-auto p-1 space-y-1">

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

        {isSubmitting || isLoadingProdCategory && <Loader />}

      </form>

    </Popup>
  );
}