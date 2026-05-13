import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useCreateVoucherNumbering, useUpdateVoucherNumbering, useDeleteVoucherNumbering, useVoucherNumberings, useVoucherNumbering } from "../hooks/voucherNumbering";

import { VoucherNumbering, OperationMode, VoucherNumberingFormData } from "../types/vouchernumbering.types";
import { VoucherNumberingSchema, VoucherNumberingFormSchema } from "../schemas/VoucherNumbering";
import { VoucherNumberingDefaultValues } from "../constants/vouchernumbering"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { vouchernumberingService } from "../services/voucherNumbering";
import { futuredateallowType, goodsServiceType, manualallowType, Statustype } from "@/common/utility/data";
import { fetchCityList, fetchStateList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";



interface VoucherNumberingFormProps {
  visible: boolean;
  onClose: () => void;
  VoucherNumberingId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function VoucherNumberingForm({ visible, onClose, VoucherNumberingId, mode }: VoucherNumberingFormProps) {
  const userId = getStorageItem("userId");
  const companyId = getStorageItem("companyId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: VoucherNumberinglist, isLoading: isLoadingVoucherNumbering } = useVoucherNumbering(VoucherNumberingId);
  const createMutation = useCreateVoucherNumbering();
  const updateMutation = useUpdateVoucherNumbering();
  const deleteMutation = useDeleteVoucherNumbering();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const { branchId, finid } = useUserStore();


  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<VoucherNumberingFormSchema>({
    resolver: zodResolver(VoucherNumberingSchema),
    defaultValues: {
      ...VoucherNumberingDefaultValues,
    },
  });


  // Fetch dropdown options for state
  const { data: voucherOptions = [] } = useQuery({
    queryKey: ["voucherList", userId],
    queryFn: () => vouchernumberingService.getAllVouchers(),
    staleTime: 0,
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
        type: s.type
      })),
  });

  // Fetch city options based on selected state
  // const { data: cityOptions = [] } = useQuery({
  //   queryKey: ["cities", userId, stateId],
  //   queryFn: () => fetchCityList(userId, stateId),
  //   enabled: !!stateId && stateId > 0,
  //   staleTime: 0,
  //   retry: 1,
  //   refetchOnWindowFocus: false,
  //   select: (data) =>
  //     (data ?? []).map((s: any) => ({
  //       value: s.id,
  //       label: s.city,
  //     })),
  // });
  // Fetch city options based on selected state
  // const { data: branchOptions = [] } = useQuery({
  //   queryKey: ["branches", userId],
  //   queryFn: () => godownService.getAllBranches(),
  //   enabled: true,
  //   staleTime: 0,
  //   retry: 1,
  //   refetchOnWindowFocus: false,
  //   select: (data) =>
  //     (data ?? []).map((s: any) => ({
  //       value: s.id,
  //       label: s.name,
  //     })),
  // });


  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === "Add") {
      reset({
        ...VoucherNumberingDefaultValues
      });
      return;
    }


    if (VoucherNumberinglist) {
      reset({
        ...VoucherNumberinglist,
      });
    }
  }, [VoucherNumberinglist, mode, visible]);

  // Submit handler
  const handleFormSubmit = async (data: VoucherNumberingFormSchema) => {
    try {


      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this VoucherNumbering?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(VoucherNumberingId);
        onClose();
        return;
      }

      const payload: VoucherNumberingFormData = {
        ...data,
        prefix: data.prefix ?? "",
        suffix: data.suffix ?? "",
        compid: Number(companyId),
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(VoucherNumberingDefaultValues);
       // onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: VoucherNumberingId,
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

  const statustypeOptions: Option[] = useMemo(
    () => Statustype.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const futuredateallowOptions: Option[] = useMemo(
    () => futuredateallowType.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const manualallowOptions: Option[] = useMemo(
    () => manualallowType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Voucher Numbering`}
      width="50vw"
      height="58vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Voucher Numbering Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Voucher Numbering Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">



              <div >
                <label className="block text-gray-700 font-medium mb-1">Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div className="flex gap-4">
            <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Voucher</label>
                  <FormSelect<VoucherNumberingFormSchema>
                    name="voucherid"
                    control={control}
                    options={voucherOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Prefix</label>
                  <input
                    type="text"
                    {...register("prefix")}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.prefix ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter address line 1"
                  />
                  {errors.prefix && <p className="text-red-500 mt-1 text-sm">{errors.prefix.message}</p>}
                </div>

                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Suffix</label>
                  <input
                    type="text"
                    {...register("suffix")}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.suffix ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter address line 2"
                  />
                  {errors.suffix && <p className="text-red-500 mt-1 text-sm">{errors.suffix.message}</p>}
                </div>

              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Max Length</label>
                  <input
                    type="number"
                    {...register("maxlength", { valueAsNumber: true })}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.maxlength ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter address line 3"
                  />
                  {errors.maxlength && <p className="text-red-500 mt-1 text-sm">{errors.maxlength.message}</p>}
                </div>

                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Last No.</label>
                  <input
                    type="number"
                    {...register("lastno", { valueAsNumber: true })}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.lastno ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter address line 3"
                  />
                  {errors.lastno && <p className="text-red-500 mt-1 text-sm">{errors.lastno.message}</p>}
                </div>

                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Manual Allow</label>
                  <FormSelect<VoucherNumberingFormSchema>
                    name="manualallow"
                    control={control}
                    options={manualallowOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
              </div>



              <div className="flex gap-4">


                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Future Date Allow</label>
                  <FormSelect<VoucherNumberingFormSchema>
                    name="futuredateallow"
                    control={control}
                    options={futuredateallowOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <FormSelect<VoucherNumberingFormSchema>
                    name="status"
                    control={control}
                    options={statustypeOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
    


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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingVoucherNumbering} showIndicator />
      </form>
    </Popup>
  );
}