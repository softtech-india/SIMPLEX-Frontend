import React, { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";

import { useBranch } from "../hooks/useBranch";
import { useCreateBranch, useUpdateBranch, useDeleteBranch } from "../hooks/useBranch";
import { fetchCityList, fetchStateList } from "@/api/master/ledger-api";
import { getStorageItem } from "@/common/utility/storage";
import { BranchFormData, OperationMode } from "../types/branch.types";
import { branchSchema, BranchFormSchema } from "../schemas/branch.schema";
import { FormSelect } from "@/common/components/FormSelect";
import { branchDefaultValues } from "../constants/branchFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";

type Option = { value: number | string; label: string };

interface BranchFormProps {
  visible: boolean;
  onClose: () => void;
  BranchId: number;
  mode: OperationMode;
}

export function BranchForm({ visible, onClose, BranchId, mode }: BranchFormProps) {

  const confirm = useConfirm();
  const userId = getStorageItem("userId");
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: branch, isLoading: isLoadingBranch } = useBranch(BranchId);
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    formState: { errors },
  } = useForm<BranchFormSchema>({
    resolver: zodResolver(branchSchema),
    defaultValues: branchDefaultValues,
  });

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(branchDefaultValues);
      return;
    }

    if (branch) {
      reset({
        ...branch,
        stateId: branch.stateId ?? 0,
        cityId: branch.cityId ?? 0,
      });
    }
  }, [branch, mode, visible, reset, setFocus]);

  const { data: states = [] } = useQuery({
    queryKey: ["states", userId],
    queryFn: () => fetchStateList(userId),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const selectedStateId = watch("stateId");

  const { data: cities = [] } = useQuery({
    queryKey: ["cities", userId, selectedStateId],
    queryFn: () => fetchCityList(userId, selectedStateId || 0),
    enabled: !!selectedStateId,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Submit handler
  const handleFormSubmit = async (data: BranchFormSchema) => {
    try {

      // if (isDeleteMode) {
      //   if (!window.confirm("Delete this branch?")) return;
      //   await deleteMutation.mutateAsync(BranchId);
      //   onClose();
      //   return;
      // }

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Branch",
          message: "Are you sure you want to delete this branch?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(BranchId);
        onClose();
        return;
      }

      const payload: BranchFormData = {
        ...data,
        stateId: data.stateId ?? 0,
        cityId: data.cityId ?? 0,
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
          id: BranchId,
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


  const stateOptions: Option[] = useMemo(
    () =>
      states.map((s: any) => ({
        value: s.id,
        label: s.state,
      })),
    [states]
  );

  const cityOptions: Option[] = useMemo(
    () =>
      cities.map((c: any) => ({
        value: c.id,
        label: c.city,
      })),
    [cities]
  );

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} branch`}
      width="90vw"
      height="90vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Branch Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Branch Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Branch Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter branch name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Print Name <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  {...register("printname")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300 ${errors.printname ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter print name"
                />
                {errors.printname && <p className="text-red-500 mt-1 text-sm">{errors.printname.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Short Name <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  {...register("shortname")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300 ${errors.shortname ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter short name"
                />
                {errors.shortname && <p className="text-red-500 mt-1 text-sm">{errors.shortname.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Business Code </label>
                <input
                  type="text"
                  {...register("code")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300 ${errors.code ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter business code"
                />
                {errors.code && <p className="text-red-500 mt-1 text-sm">{errors.code.message}</p>}
              </div>

            </div>
          </section>

          {/* Address & Contact */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Address & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("add1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.add1 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 1"
                />
                {errors.add1 && <p className="text-red-500 mt-1 text-sm">{errors.add1.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  {...register("add2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.add2 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 2"
                />
                {errors.add2 && <p className="text-red-500 mt-1 text-sm">{errors.add2.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 3</label>
                <input
                  type="text"
                  {...register("add3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.add3 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 3"
                />
                {errors.add3 && <p className="text-red-500 mt-1 text-sm">{errors.add3.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 4</label>
                <input
                  type="text"
                  {...register("add4")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.add4 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 4"
                />
                {errors.add4 && <p className="text-red-500 mt-1 text-sm">{errors.add4.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">State <span className="text-red-500">*</span></label>

                <FormSelect<BranchFormSchema>
                  name="stateId"
                  control={control}
                  options={stateOptions}
                  placeholder="Select state"
                  isDisabled={isReadOnly}
                />
                {/* {errors.stateId && <p className="text-red-500 mt-1 text-sm">{errors.stateId.message}</p>} */}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">City <span className="text-red-500">*</span></label>
                <FormSelect<BranchFormSchema>
                  name="cityId"
                  control={control}
                  options={cityOptions}
                  placeholder="Select city"
                  isDisabled={isReadOnly}
                />
                {/* {errors.cityId && <p className="text-red-500 mt-1 text-sm">{errors.cityId.message}</p>} */}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <input
                  type="text"
                  {...register("pin")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.pin ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter pincode"
                />
                {errors.pin && <p className="text-red-500 mt-1 text-sm">{errors.pin.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Mobile</label>
                <input
                  type="text"
                  {...register("phone")}
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                  }}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter mobile number"
                />
                {errors.phone && <p className="text-red-500 mt-1 text-sm">{errors.phone.message}</p>}
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  disabled={isReadOnly}
                  className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                  placeholder="Enter email..."
                />
                {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Website</label>
                <input
                  type="website"
                  {...register("website")}
                  disabled={isReadOnly}
                  className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                  placeholder="Enter website..."
                />
                {errors.website && <p className="text-red-500 mt-1 text-sm">{errors.website.message}</p>}
              </div>


            </div>
          </section>

          {/* Statutory Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Statutory Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {["gstin", "ieccode"].map((field) => {
                const fieldError = errors[field as keyof BranchFormData];
                const requiredFields = ["gstin"];
                const isRequired = requiredFields.includes(field);

                return (
                  <div key={field}>
                    <label className="block text-gray-700 font-medium mb-1">
                      {field.toUpperCase()}{" "}
                      {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      {...register(field as keyof BranchFormData)}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 transition ${fieldError ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
                        }`}
                    />
                    {fieldError && (
                      <p className="text-red-500 mt-1 text-sm">{fieldError.message as string}</p>
                    )}
                  </div>
                );
              })}
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingBranch} showIndicator />
      </form>
    </Popup>
  );
}