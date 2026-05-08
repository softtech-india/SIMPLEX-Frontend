import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useCreateBillType, useUpdateBillType, useDeleteBillType, useBillTypes, useBillType } from "../hooks/billtype";

import { BillType, OperationMode, BillTypeFormData } from "../types/billtype.types";
import { BillTypeSchema, BillTypeFormSchema } from "../schemas/billtype.schema";
import { BillTypeDefaultValues } from "../constants/billtype"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { billTypeService } from "../services/billtype";
import { billType, goodsServiceType, isDefault, isTaxInclude, StatusOfBillType, taxApplicable, taxRegion, transactionType } from "@/common/utility/data";
import { fetchCityList, fetchStateList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";

interface BillTypeFormProps {
  visible: boolean;
  onClose: () => void;
  BillTypeId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };

export function BillTypeForm({ visible, onClose, BillTypeId, mode }: BillTypeFormProps) {
  const userId = getStorageItem("userId");
  const companyId = getStorageItem("companyId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: BillTypelist, isLoading: isLoadingBillType } = useBillType(BillTypeId);
  const createMutation = useCreateBillType();
  const updateMutation = useUpdateBillType();
  const deleteMutation = useDeleteBillType();
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
  } = useForm<BillTypeFormSchema>({
    resolver: zodResolver(BillTypeSchema),
    defaultValues: {
      ...BillTypeDefaultValues,
    },
  });

  // Watch the 'type' field to get its current value
  const selectedType = watch("type");

  // Get the gType based on selected type
  const selectedGType = useMemo(() => {
    if (!selectedType) return null;
    const typeOption = billType.find(t => t.id === selectedType);
    return typeOption?.gType || null;
  }, [selectedType]);

  // Fetch ledger options - this will automatically trigger when selectedGType changes
  const { data: accountHeadOptions = [], isLoading: isLoadingLedgers } = useQuery({
    queryKey: ["accountHeadList", userId, selectedGType], // Add selectedGType to query key
    queryFn: () => {
      if (!selectedGType) return Promise.resolve([]);
      return billTypeService.getAllLedgers(selectedGType);
    },
    staleTime: 0,
    enabled: !!companyId && !!selectedGType, // Only run when both companyId and selectedGType exist
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.ledgername
      })),
  });

  const typeOptions: Option[] = useMemo(
    () => billType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const taxRegionOptions: Option[] = useMemo(
    () => taxRegion.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const transactionTypeOptions: Option[] = useMemo(
    () => transactionType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const taxApplicableOptions: Option[] = useMemo(
    () => taxApplicable.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const istaxincludeOptions: Option[] = useMemo(
    () => isTaxInclude.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const isDefaultOptions: Option[] = useMemo(
    () => isDefault.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const statusOfBillTypeOptions: Option[] = useMemo(
    () => StatusOfBillType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === "Add") {
      reset({
        ...BillTypeDefaultValues

      });
      // Reset account head when adding new bill type
      setValue("accountheadid", 0);
      return;
    }

    if (BillTypelist) {
      reset({
        ...BillTypelist,
        taxapplicable: BillTypelist.taxapplicable?.trim(),

      });
    }
  }, [BillTypelist, mode, visible, setFocus, setValue, reset]);

  // Clear account head selection when type changes (optional but recommended)
  useEffect(() => {
    if (selectedType && isAddMode) {
      setValue("accountheadid", 0);
    }
  }, [selectedType, setValue, isAddMode]);

  // Submit handler
  const handleFormSubmit = async (data: BillTypeFormSchema) => {
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this Bill type?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(BillTypeId!);
        onClose();
        return;
      }

      const payload: BillTypeFormData = {
        ...data,
        name: data.name ?? "",
        type: data.type ?? "",
        accspecify: data.accspecify ?? "SG",
        accountheadid: data.accountheadid ?? 0,
        taxregion: data.taxregion ?? "",
        typeoftransaction: data.typeoftransaction ?? "",
        taxapplicable: data.taxapplicable ?? "",
        istaxinclude: data.istaxinclude ?? "",
        isdefault: data.isdefault ?? "",
        posapplicable: data.posapplicable ?? "N",
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(BillTypeDefaultValues);
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: BillTypeId!,
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
      title={`${mode} Bill Type`}
      width="50vw"
      height="57vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* BillType Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Bill Type Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    {...register("name")}
                    disabled={isReadOnly}
                    ref={(e) => {
                      register("name").ref(e);
                      if (e && visible && isAddMode) defaultFocusRef.current = e;
                    }}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter Name"
                  />
                  {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Type</label>
                  <FormSelect<BillTypeFormSchema>
                    name="type"
                    control={control}
                    options={typeOptions}
                    placeholder="Select type"
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-2/3">
                  <label className="block text-gray-700 font-medium mb-1">
                    Account Head
                    {selectedType && !selectedGType && <span className="text-gray-400 text-sm ml-2">(Select type first)</span>}
                    {isLoadingLedgers && <span className="text-blue-500 text-sm ml-2">Loading...</span>}
                  </label>
                  <FormSelect<BillTypeFormSchema>
                    name="accountheadid"
                    control={control}
                    options={accountHeadOptions}
                    isDisabled={isReadOnly || !selectedGType || isLoadingLedgers}
                    placeholder={!selectedGType ? "Please select type first" : "Select account head"}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Tax Region</label>
                  <FormSelect<BillTypeFormSchema>
                    name="taxregion"
                    control={control}
                    options={taxRegionOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Transaction Type</label>
                  <FormSelect<BillTypeFormSchema>
                    name="typeoftransaction"
                    control={control}
                    options={transactionTypeOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Tax Applicable</label>
                  <FormSelect<BillTypeFormSchema>
                    name="taxapplicable"
                    control={control}
                    options={taxApplicableOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
              </div>
              <div className="flex gap-4">

                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Include Tax</label>
                  <FormSelect<BillTypeFormSchema>
                    name="istaxinclude"
                    control={control}
                    options={istaxincludeOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-gray-700 font-medium mb-1">Default</label>
                  <FormSelect<BillTypeFormSchema>
                    name="isdefault"
                    control={control}
                    options={isDefaultOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                {isEditMode &&
                  <div className="w-1/3">
                    <label className="block text-gray-700 font-medium mb-1">Status</label>
                    <FormSelect<BillTypeFormSchema>
                      name="status"
                      control={control}
                      options={statusOfBillTypeOptions}
                      isDisabled={isReadOnly}
                    />
                  </div>
                }
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

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isSubmitting || isLoadingBillType || isLoadingLedgers}
          showIndicator
        />
      </form>
    </Popup>
  );
}

