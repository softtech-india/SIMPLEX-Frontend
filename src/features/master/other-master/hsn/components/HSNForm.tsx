import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useHSNs } from "../hooks/hsn";
import { useCreateHSN, useUpdateHSN, useDeleteHSN, useHSN } from "../hooks/hsn";

import { HSN, OperationMode, HSNFormData } from "../types/hsn.types";
import { HSNSchema, HSNFormSchema } from "../schemas/hsn.schema";
import { HSNDefaultValues } from "../constants/hsn"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { hSNService } from "../services/hsn";
import { goodsServiceType } from "@/common/utility/data";

interface HSNFormProps {
  visible: boolean;
  onClose: () => void;
  HSNId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function HSNForm({ visible, onClose, HSNId, mode }: HSNFormProps) {
  const userId = getStorageItem("userId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: HSNlist, isLoading: isLoadingHSN } = useHSN(HSNId);
  const createMutation = useCreateHSN();
  const updateMutation = useUpdateHSN();
  const deleteMutation = useDeleteHSN();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    formState: { errors },
  } = useForm<HSNFormSchema>({
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
  // Submit handler
  const handleFormSubmit = async (data: HSNFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this HSN?",
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
        await createMutation.mutateAsync(payload);
        reset(HSNDefaultValues);
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
      height="60vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* HSN Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              HSN Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">HSN<span className="text-red-500">*</span></label>
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
                <label className="block text-gray-700 font-medium mb-1">HSN Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("description")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product HSN description"
                />
                {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
              </div>


              <div className="">
                <label className="block text-gray-700 font-medium mb-1">GST</label>
                <FormSelect
                  name="gstid"
                  control={control}
                  options={gstOptions}
                />
              </div>
              <div className="">
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingHSN} showIndicator />
      </form>
    </Popup>
  );
}