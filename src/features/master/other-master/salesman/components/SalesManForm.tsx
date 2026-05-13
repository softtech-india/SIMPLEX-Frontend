import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import {
  useCreateSalesMan,
  useUpdateSalesMan,
  useDeleteSalesMan,
  useSalesMan,
} from "../hooks/salesman";

import {
  SalesMan,
  OperationMode,
  SalesManFormData,
} from "../types/salesman";

import {
  SalesManSchema,
  SalesManFormSchema,
} from "../schemas/salesman.schema";

import { SalesManDefaultValues } from "../constants/salesman";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { FormSelect } from "@/common/components/FormSelect";
import { salesManService } from "../services/salesman";
import { salesManStatus, StatusOfBillType } from "@/common/utility/data";

interface SalesManFormProps {
  visible: boolean;
  onClose: () => void;
  SalesManId: number;
  mode: OperationMode;
  toolbarBranchId: string | null;
}

type Option = { value: number | string; label: string };



export function SalesManForm({
  visible,
  onClose,
  SalesManId,
  mode,
  toolbarBranchId
}: SalesManFormProps) {
  const confirm = useConfirm();
  const userId = getStorageItem("userId");
  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const {
    data: salesManData,
    isLoading: isLoadingSalesMan,
  } = useSalesMan(SalesManId);

  const createMutation = useCreateSalesMan();
  const updateMutation = useUpdateSalesMan();
  const deleteMutation = useDeleteSalesMan();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    control,
    formState: { errors },
  } = useForm<SalesManFormSchema>({
    resolver: zodResolver(SalesManSchema),
    defaultValues: {
      ...SalesManDefaultValues,
    },
  });

  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 500);

    if (mode === "Add") {
      reset({
        ...SalesManDefaultValues,
      });
      return;
    }

    if (salesManData) {
      reset({
        ...salesManData,
      });
    }
  }, [salesManData, mode, visible, setFocus, reset]);

  const handleFormSubmit = async (data: SalesManFormSchema) => {
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete SalesMan",
          message: "Are you sure you want to delete this salesman?",
        });
        if (!ok) return;
        await deleteMutation.mutateAsync(SalesManId);
        onClose();
        return;
      }

      const payload: SalesManFormData = {
        ...data,
        name: data.name ?? "",
        branchid: Number(data.branchid ?? 0),
        addr1: data.addr1 ?? "",
        addr2: data.addr2 ?? "",
        addr3: data.addr3 ?? "",
        mobno: data.mobno ?? "",
        phno: data.phno ?? "",
        email: data.email ?? "",
        status: data.status ?? "Y",
      };

      if (isAddMode) {
        const response = await createMutation.mutateAsync(payload);

        if (response?.success) {
          reset(SalesManDefaultValues);
          defaultFocusRef.current?.focus();
        }

        return;
      }

      if (isEditMode) {
        const response = await updateMutation.mutateAsync({
          id: SalesManId,
          data: payload,
        });

        // Only close if update was successful
        if (response?.success) {
          onClose();
        }
        // If not successful, form stays open for user to correct
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Error is already handled by toast in the mutation
      // Form stays as is so user can try again
    }
  };

  const { data: BranchOptions = [] } = useQuery({
    queryKey: ["branchList", userId],
    queryFn: () => salesManService.getAllBranch(),
    staleTime: 0,
    enabled: true,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

  const salesmanStatusOptions: Option[] = useMemo(
    () => salesManStatus.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} SalesMan`}
      width="50vw"
      height="75vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              SalesMan Information
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  ref={(e) => {
                    register("name").ref(e);
                    if (e && visible && isAddMode) {
                      defaultFocusRef.current = e;
                    }
                  }}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter Name"
                />

                {errors.name && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Branch ID */}
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium mb-1">Branch</label>
                <FormSelect<SalesManFormSchema>
                  name="branchid"
                  control={control}
                  options={BranchOptions}
                  isDisabled={isReadOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Address 1 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 1
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr1 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr1"
                />

                {errors.addr1 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr1.message}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 2
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr2 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr2"
                />

                {errors.addr2 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr2.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Address 3 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 3
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr3 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr3"
                />

                {errors.addr3 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr3.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Mobile No
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("mobno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.mobno ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter mobno"
                />

                {errors.mobno && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.mobno.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone No.
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("phno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phno ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter phno"
                />

                {errors.phno && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.phno.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("email")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter email"
                />

                {errors.email && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              {/* status */}
              <div className="w-1/3">
                <label className="block text-gray-700 font-medium mb-1">Status</label>
                <FormSelect<SalesManFormSchema>
                  name="status"
                  control={control}
                  options={salesmanStatusOptions}
                  isDisabled={isReadOnly}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {mode !== "View" && mode !== "Print" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? "delete-btn" : "primary-btn"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? isDeleteMode
                  ? "Deleting..."
                  : "Saving..."
                : isDeleteMode
                  ? "Delete"
                  : "Save"}
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

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isSubmitting || isLoadingSalesMan}
          showIndicator
        />
      </form>
    </Popup>
  );
}