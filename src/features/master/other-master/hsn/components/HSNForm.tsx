import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useCreateHSN, useUpdateHSN, useDeleteHSN, useHSN } from "../hooks/hsn";

import { OperationMode, HSNFormData } from "../types/hsn.types";
import { HSNSchema, HSNFormSchema } from "../schemas/hsn.schema";
import { HSNDefaultValues } from "../constants/hsn"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { hSNService } from "../services/hsn";
import { goodsServiceType } from "@/common/utility/data";
import useUserStore from "@/store/userStore";
import Loader from "@/common/components/Loader";
import { Save, XCircle } from "lucide-react";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";

interface HSNFormProps {
  visible: boolean;
  onClose: () => void;
  HSNId: number;
  mode: OperationMode;
  returnAfterSave?: boolean;
  onSuccess?: (product: any) => void;
}

type Option = { value: number | string; label: string };


export function HSNForm({ visible, onClose, HSNId, mode, returnAfterSave, onSuccess }: HSNFormProps) {

  // Hooks
  const { userId, companyId, branchId, finid, } = useUserStore();
  const confirm = useConfirm();

  // State
  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: HSNlist, isLoading: isLoadingHSN } = useHSN(HSNId);
  const createMutation = useCreateHSN();
  const updateMutation = useUpdateHSN();
  const deleteMutation = useDeleteHSN();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const { control, register, handleSubmit, setFocus, reset, watch, formState: { errors }, } = useForm<HSNFormSchema>({
    resolver: zodResolver(HSNSchema),
    defaultValues: HSNDefaultValues,
  });

  const { data: gsts = [] } = useQuery({
    queryKey: ["gsts", userId],
    queryFn: () => hSNService.getAllGSTs(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const gstOptions: Option[] = useMemo(
    () =>
      gsts.map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
    [gsts]
  );

  const GoodServiceOptions: Option[] = useMemo(
    () => goodsServiceType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("hsn");
    }, 1000);

    if (mode === "Add") {
      reset(HSNDefaultValues);
      return;
    }


    if (HSNlist && gsts.length > 0) {
      reset({
        ...HSNlist,
        gstid: Number(HSNlist?.gstid ?? 0)
      });
    }
  }, [HSNlist, gsts.length, mode, visible]);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };


  // Submit handler
  const handleFormSubmit = async (data: HSNFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this HSN?",
          confirmText: "Delete",
          variant: "danger",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(HSNId);
        onClose();
        return;
      }

      const payload: HSNFormData = {
        ...data,
        gstid: data.gstid ?? 0,
      };

      if (isAddMode) {
        const result = await createMutation.mutateAsync(payload);
        reset(HSNDefaultValues);
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
          id: HSNId,
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
      title={`${mode} HSN`}
      width="40vw"
      height="40vh"
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
              <h1 className="text-base font-semibold ">HSN </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>


          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-1">
              <div>
                <label className="block text-gray-700 font-medium mb-1">HSN <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  {...register("hsn")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.hsn ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter HSN"
                />
                {errors.hsn && <p className="text-red-500 mt-1 text-sm">{errors.hsn.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">HSN Description <strong className="text-red-500"> * </strong></label>
                <input
                  type="text"
                  {...register("description")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product HSN description"
                />
                {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">GST <strong className="text-red-500"> * </strong> </label>
                <FormSelect
                  name="gstid"
                  control={control}
                  options={gstOptions}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Type</label>
                <FormSelect<HSNFormSchema>
                  name="type"
                  control={control}
                  options={GoodServiceOptions}
                  placeholder="Select type"
                  isDisabled={isReadOnly}
                />
              </div>

            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-2 flex justify-end gap-4 bg-white">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} flex items-center gap-1.5 p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={15} /> {isSubmitting ? "Saving..." : getButtonLabel()}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn flex items-center gap-1.5 p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={15} />  Exit
          </button>

        </div>

        {(isSubmitting || isLoadingHSN) && <Loader />}

      </form>
    </Popup>
  );
}