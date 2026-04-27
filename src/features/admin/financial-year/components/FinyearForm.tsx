import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useFinyear } from "../hooks/useFinyear";
import { useCreateFinyear, useUpdateFinyear, useDeleteFinyear } from "../hooks/useFinyear";
import { getStorageItem } from "@/common/utility/storage";
import { FinYearFormType, OperationMode } from "../types/finyear.types";
import { finyearSchema, finyearFormSchema } from "../schemas/finyear.schema";
import { finyearDefaultValues } from "../constants/finyearFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { formatDateForInput } from "@/helpers/dateUtils";

interface FinyearFormProps {
  visible: boolean;
  onClose: () => void;
  FinyearId: number;
  mode: OperationMode;
}

export function FinyearForm({ visible, onClose, FinyearId, mode }: FinyearFormProps) {

  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Finyear, isLoading: isLoadingFinyear } = useFinyear(FinyearId);
  const createMutation = useCreateFinyear();
  const updateMutation = useUpdateFinyear();
  const deleteMutation = useDeleteFinyear();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<finyearFormSchema>({
    resolver: zodResolver(finyearSchema),
    defaultValues: finyearDefaultValues,
  });

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("finstdt");
    }, 1000);

    if (mode === 'Add') {
      reset(finyearDefaultValues);
      return;
    }

    if (Finyear) {
      reset({
        ...Finyear,

        finstdt: formatDateForInput(Finyear.finstdt),
        finenddt: formatDateForInput(Finyear.finenddt),

      });
    }
  }, [Finyear, mode, visible, reset, setFocus]);


  // Submit handler
  const handleFormSubmit = async (data: finyearFormSchema) => {
    try {

      console.log("from date: ", data);

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Finyear",
          message: "Are you sure you want to delete this Finyear?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(FinyearId);
        onClose();
        return;
      }

      const payload: FinYearFormType = {
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
          id: FinyearId,
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
      title={`${mode} Financial Year`}
      width="35vw"
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

          {/* Financial year Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Financial Year Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Finaancial year start date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  {...register("finstdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.finstdt ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Finaancial year start date"
                />
                {errors.finstdt && <p className="text-red-500 mt-1 text-sm">{errors.finstdt.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Finaancial year end date <span className="text-red-500">*</span> </label>
                <input
                  type="date"
                  {...register("finenddt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300 ${errors.finenddt ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Finaancial year end date "
                />
                {errors.finenddt && <p className="text-red-500 mt-1 text-sm">{errors.finenddt.message}</p>}
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingFinyear} showIndicator />
      </form>
    </Popup>
  );
}