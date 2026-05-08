import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useCreateGodown, useUpdateGodown, useDeleteGodown, useGodowns, useGodown } from "../hooks/godown";

import { Godown, OperationMode, GodownFormData } from "../types/godown.types";
import { GodownSchema, GodownFormSchema } from "../schemas/godown.schema";
import { GodownDefaultValues } from "../constants/godown"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { godownService } from "../services/godown";
import { goodsServiceType } from "@/common/utility/data";
import { fetchCityList, fetchStateList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";



interface GodownFormProps {
  visible: boolean;
  onClose: () => void;
  GodownId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function GodownForm({ visible, onClose, GodownId, mode }: GodownFormProps) {
  const userId = getStorageItem("userId");
  const companyId = getStorageItem("companyId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Godownlist, isLoading: isLoadingGodown } = useGodown(GodownId);
  const createMutation = useCreateGodown();
  const updateMutation = useUpdateGodown();
  const deleteMutation = useDeleteGodown();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    branchId,
    finid
  } = useUserStore();

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<GodownFormSchema>({
    resolver: zodResolver(GodownSchema),
    defaultValues: {
      ...GodownDefaultValues,
    },
  });

  // const { data: gsts = [] } = useQuery({
  //   queryKey: ["gsts", userId],
  //   queryFn: () => godownService.getAllGSTs(),
  //   staleTime: 0,
  //   retry: 1,
  //   refetchOnWindowFocus: false,
  // });

  // const gstOptions: Option[] = useMemo(
  //   () =>
  //     gsts.map((s: any) => ({
  //       value: s.id,
  //       label: s.name,
  //     })),
  //   [gsts]
  // );

  // Fetch dropdown options for state
  const { data: stateOptions = [] } = useQuery({
    queryKey: ["stateList", userId],
    queryFn: () => fetchStateList(userId),
    staleTime: 0,
    enabled: !!companyId,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.state,
      })),
  });

  const stateId = watch("stateid")
  // Fetch city options based on selected state
  const { data: cityOptions = [] } = useQuery({
    queryKey: ["cities", userId, stateId],
    queryFn: () => fetchCityList(userId, stateId),
    enabled: !!stateId && stateId > 0,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.city,
      })),
  });
  // Fetch city options based on selected state
  const { data: branchOptions = [] } = useQuery({
    queryKey: ["branches", userId],
    queryFn: () => godownService.getAllBranches(),
    enabled: true,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });


  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === "Add") {
      reset({
        ...GodownDefaultValues
      });
      return;
    }


    if (Godownlist) {
      reset({
        ...Godownlist,
      });
    }
  }, [Godownlist, mode, visible]);

  // Submit handler
  const handleFormSubmit = async (data: GodownFormSchema) => {
    try {


      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this godown?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(GodownId);
        onClose();
        return;
      }

      const payload: GodownFormData = {
        ...data,
        addr2: data.addr2 ?? "",
        addr3: data.addr3 ?? ""
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(GodownDefaultValues);
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: GodownId,
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
      title={`${mode} Godown`}
      width="50vw"
      height="66vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Godown Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Godown Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div className="flex gap-4">

                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Branch</label>
                  <FormSelect<GodownFormSchema>
                    name="branchid"
                    control={control}
                    options={branchOptions}
                    isDisabled={isReadOnly}
                  />
                </div>

                <div className="w-1/2">
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
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address line 1<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("addr1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr1 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 1"
                />
                {errors.addr1 && <p className="text-red-500 mt-1 text-sm">{errors.addr1.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address line 2</label>
                <input
                  type="text"
                  {...register("addr2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr2 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 2"
                />
                {errors.addr2 && <p className="text-red-500 mt-1 text-sm">{errors.addr2.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address line 3</label>
                <input
                  type="text"
                  {...register("addr3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr3 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 3"
                />
                {errors.addr3 && <p className="text-red-500 mt-1 text-sm">{errors.addr3.message}</p>}
              </div>
              <div className="flex gap-4">

                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">State</label>
                  <FormSelect<GodownFormSchema>
                    name="stateid"
                    control={control}
                    options={stateOptions}
                    isDisabled={isReadOnly}
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">City</label>
                  <FormSelect<GodownFormSchema>
                    name="cityid"
                    control={control}
                    options={cityOptions}
                    isDisabled={isReadOnly || !stateId}
                  />
                </div>
                <div className="w-1/6">
                  <label className="block text-gray-700 font-medium mb-1">Pin</label>
                  <input
                    type="text"
                    {...register("pin")}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.pin ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter pin"
                  />
                  {errors.pin && <p className="text-red-500 mt-1 text-sm">{errors.pin.message}</p>}
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingGodown} showIndicator />
      </form>
    </Popup>
  );
}