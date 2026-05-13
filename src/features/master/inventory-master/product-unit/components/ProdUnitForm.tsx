import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useProdUnits } from "../hooks/prodUnit";
import { useCreateProdUnit, useUpdateProdUnit, useDeleteProdUnit, useProdUnit, useGstUnit } from "../hooks/prodUnit";

import { ProdUnit, OperationMode, ProdUnitFormData } from "../types/prodUnit.types";
import { prodUnitSchema, prodUnitFormSchema } from "../schemas/prodUnit.schema";
import { prodUnitDefaultValues } from "../constants/prodUnitFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { prodUnitService } from "../services/prodUnit";

interface ProdUnitFormProps {
  visible: boolean;
  onClose: () => void;
  ProdUnitId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function ProdUnitForm({ visible, onClose, ProdUnitId, mode }: ProdUnitFormProps) {
  const userId = getStorageItem("userId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: prodUnitlist, isLoading: isLoadingProdUnit } = useProdUnit(ProdUnitId);
  const createMutation = useCreateProdUnit();
  const updateMutation = useUpdateProdUnit();
  const deleteMutation = useDeleteProdUnit();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<prodUnitFormSchema>({
    resolver: zodResolver(prodUnitSchema),
    defaultValues: prodUnitDefaultValues,
  });

  const { data: gstUnits = [] } = useQuery({
    queryKey: ["gstUnits", userId],
    queryFn: () => prodUnitService.getAllGstUnits(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const gstUnitOptions: Option[] = useMemo(
    () =>
      gstUnits.map((s: any) => ({
        value: s.gstunit,
        label: s.gstunit,
      })),
    [gstUnits]
  );

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(prodUnitDefaultValues);
      return;
    }

    if (prodUnitlist) {
      reset({
        ...prodUnitlist,
        
      });
    }

  }, [prodUnitlist, mode, visible, reset, setFocus]);



  // Submit handler
  const handleFormSubmit = async (data: prodUnitFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product unit",
          message: "Are you sure you want to delete this product unit?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(ProdUnitId);
        onClose();
        return;
      }

      const payload: ProdUnitFormData = {
        ...data,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(prodUnitDefaultValues);
        //onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: ProdUnitId,
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
      title={`${mode} product Unit`}
      width="60vw"
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

          {/* Product Unit Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Product Unit Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product unit name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("description")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product unit description"
                />
                {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit DecimalPlace <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register("decimalplace", { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.decimalplace ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter decimalplace"
                />
                {errors.decimalplace && <p className="text-red-500 mt-1 text-sm">{errors.decimalplace.message}</p>}
              </div>

              <div className="z-[101]">
                <label className="block text-gray-700 font-medium mb-1">GST Unit</label>
                <FormSelect<prodUnitFormSchema>
                  name="gstunit"
                  control={control}
                  options={gstUnitOptions}
                  placeholder="Select gst unit"
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingProdUnit} showIndicator />
      </form>
    </Popup>
  );
}