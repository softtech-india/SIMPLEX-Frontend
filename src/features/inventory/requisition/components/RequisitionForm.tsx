'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { useRequisitionById, useCreateRequisition, useUpdateRequisition, useDeleteRequisition } from "../hooks/useRequisition";
import { RequisitionFormType, OperationMode } from "../types/requisition.types";
import { RequisitionFormSchema } from "../schemas/requisition.schema";
import { requisitionFormDefaults } from "../constants/requisitionFormDefaults";
import { useRequisitionForm } from "../hooks/useRequisitionForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { RequisitionItems } from "./RequisitionItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { LoadPanel } from "devextreme-react";
import { useConfirm } from "@/common/hooks/useConfirm";
import { LOOKUP_KEYS } from "@/common/constants/lookupKeys";
import { useLookupShortcuts } from "@/common/hooks/useLookupShortcuts";

interface RequisitionFormProps {
  visible: boolean;
  onClose: () => void;
  formRequisitionId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function RequisitionForm({ visible, onClose, formRequisitionId, mode, formSelectedBranch, toolbarBranchId }: RequisitionFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const confirmDelete = useConfirm();

  const [toBranchModalOpen, setToBranchModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [toGodownModalOpen, setToGodownModalOpen] = useState(false);
  const toGodownRef = useRef<HTMLInputElement>(null);


  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Requisition, isLoading: isLoadingRequisition } =
    useRequisitionById({
      id: formRequisitionId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateRequisition();
  const updateMutation = useUpdateRequisition();
  const deleteMutation = useDeleteRequisition();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useRequisitionForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemdtl",
  });

  // Calculate Total Quantity
  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  }) || [];

  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty) || 0);
  }, 0) || 0;


  // Reset form 
  useEffect(() => {

    if (!visible) return;

    setTimeout(() => {
      setFocus("reqdt");
    }, 1000);

    if (isAddMode) {
      reset(requisitionFormDefaults);
      return;
    }

    if (Requisition) {
      reset({
        ...requisitionFormDefaults,
        ...Requisition,
        compid: Number(Requisition.compid ?? 0),
        branchid: Number(Requisition.branchid ?? 0),
        finid: Number(Requisition.finid ?? 0),
        vnumid: Number(Requisition.vnumid ?? 0),
        vnummethod: Requisition.vnummethod ?? "",
        reqdt: Requisition.reqdt ? formatDateForInput(Requisition.reqdt) : "",
        reqno: Requisition.reqno ?? "",
        totqty: Number(Requisition.totqty ?? 0),
        godownid: Number(Requisition.godownid ?? 0),
        godownName: Requisition.godownnm ?? '',  // Changed: map godownnm to godownName
        tobranchid: Number(Requisition.tobranchid ?? 0),
        toBranchName: Requisition.tobranchnm ?? '',  // Changed: map tobranchnm to toBranchName
        togodownid: Number(Requisition.togodownid ?? 0),
        togodownName: Requisition.togodownnm ?? '',  // Changed: map togodownnm to togodownName
        rem1: Requisition.rem1 ?? "",
        rem2: Requisition.rem2 ?? "",
        itemdtl:
          Requisition.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            productid: item.productid,
            qty: Number(item.qty ?? 0),
            productnm: item.productnm ?? "", // ADD THIS - map product name
            pcategoryid: item.pcategoryid, // ADD THIS - map brand/category ID
            pcategorynm: item.pcategorynm ?? "",
          })) ?? [],
      });
    }

  }, [Requisition, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "REQ";
  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: ["fetchSeriesList", userId, companyId, toolbarBranchId, voucherType],
    queryFn: () =>
      fetchSeriesList(userId, companyId, toolbarBranchId, voucherType, finid),
    staleTime: 0,
    enabled: !!companyId && !!toolbarBranchId && !!userId && !!visible,
    retry: 1,
    refetchOnWindowFocus: true,

    select: (data) => {
      const options =
        (data ?? []).map((s: any) => ({
          value: s.id,
          label: s.name,
          manualallow: s.manualallow,
        })) || [];

      setTimeout(() => {
        if (options.length > 0 && !watch("vnumid")) {
          setValue("vnumid", options[0].value);
        }
      }, 0);

      return options;
    },
  });

  const selectedSeries = seriesNoOptions.find(
    (s: any) => s.value === watch("vnumid")
  );
  // End Series No Options


  // Search Modal Handlers
  const baseSearchParams = {
    userid: userId,
    compid: companyId,
  };

  const searchColumns = [
    { key: "name", label: "Name" },
  ];

  const searchFields = [
    { value: "name", label: "Name" },
  ];

  // To Branch Modal Handler
  const handleToBranchSelect = (row: any) => {
    setValue("tobranchid", (row.id));
    setValue("toBranchName", (row.name));
    setToBranchModalOpen(false);
    setValue("togodownid", 0);
    setValue("togodownName", "");
  };
  if (!watch("tobranchid")) {
    setValue("tobranchid", toolbarBranchId);
  }
  if (!watch("toBranchName")) {
    setValue("toBranchName", formSelectedBranch);
  }
  const toBranchName = watch("toBranchName") || formSelectedBranch;

  // From Godown Modal Handler 
  const handleFromGodownSelect = (row: any) => {
    setValue("godownid", row.id);
    setValue("godownName", row.name);
    setGodownModalOpen(false);
    setValue("togodownid", 0);
    setValue("togodownName", '');
    requestAnimationFrame(() => {

      toGodownRef.current?.focus();

    });
  };
  const fromGodownId = watch("godownid");
  const fromGodownName = watch("godownName");

  // To Godown Modal Handler
  const handleToGodownSelect = (row: any) => {
    setValue("togodownid", row.id);
    setValue("togodownName", row.name);
    setToGodownModalOpen(false);
  };
  const togodownName = watch("togodownName");

  const calculateTotals = (items: any[] = []) => {
    let totqty = 0;

    const itemdtl = items.map((item, index) => {
      const qty = Number(item?.qty) || 0;
      totqty += qty;

      return {
        tag: item?.tag || "I",
        dtlid: item?.dtlid || index + 1,
        productid: Number(item.productid ?? 0),
        qty: Number(qty),
      };
    });

    return { totqty, itemdtl };
  };


  const lookupMap = {
    godownid: () => setGodownModalOpen(true),
  };

  const bindLookup = useLookupShortcuts(isReadOnly, lookupMap);

  const handleFormSubmit = async (data: RequisitionFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Requisition",
          message: "Are you sure you want to delete this Requisition?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(formRequisitionId);
        onClose();
        return;
      }

      const { totqty, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: RequisitionFormType = {
        ...data,
        compid: companyId,
        branchid: toolbarBranchId,
        finid: Number(finid),
        totqty: Number(totqty),
        itemdtl,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(requisitionFormDefaults);
        // onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formRequisitionId,
          data: payload,
        });
        onClose();
        return;
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };


  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };

  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  const handleKeyOpen = (e: React.KeyboardEvent, openFn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFn();
    }
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Requisition`}
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

          {/* Requisition Info */}
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Requisition Information
            </h2>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Series No.</label>
                <FormSelect
                  name="vnumid"
                  control={control}
                  options={seriesNoOptions}
                  isDisabled={isReadOnly}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Num. Method</label>
                <FormSelect
                  name="vnummethod"
                  control={control}
                  options={numMethodOptions}
                  isDisabled={isReadOnly || selectedSeries?.manualallow === "N"}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Requisition Date</label>
                <input
                  type="date"
                  {...register("reqdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.reqdt ? "border-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Requisition No.</label>
                <input
                  type="text"
                  {...register("reqno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`inputField ${errors.reqno ? "border-red-500" : "border-gray-400"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Requisition Number"
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 bg-gray-100 cursor-not-allowed `}
                />
              </div>
            </div>
          </section>

          {/* Transfer Details */}
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Transfer Details
            </h2>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-98">
                <label className="block text-gray-700 font-medium mb-1"> From Godown <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={fromGodownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  {...bindLookup(LOOKUP_KEYS.customer)}
                  onKeyDown={(e) => handleKeyOpen(e, () => setGodownModalOpen(true))}

                  onClick={() => { setGodownModalOpen(true); }}
                  className={`inputField w-full cursor-pointer 
                    ${errors?.godownid ? "border-red-500" : "border-gray-400"} 
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Select Godown"
                />
                {errors?.godownid && (<p className="text-xs text-red-500 mt-1">{errors.godownid.message}</p>)}
              </div>

              <div className="w-102">
                <label className="block text-gray-700 font-medium mb-1">  To Branch <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={toBranchName || ''}
                  // disabled={isReadOnly}
                  disabled={true}
                  onClick={() => { setToBranchModalOpen(true); }}
                  tabIndex={-1}
                  readOnly
                  className={`inputField w-full cursor-pointer
                    ${errors?.tobranchid ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-gray-100 cursor-not-allowed"}
                  `}
                  placeholder="Select Branch"
                />
                {errors?.tobranchid && (<p className="text-xs text-red-500 mt-1">{errors.tobranchid.message}</p>)}
              </div>

              <div className="w-102">
                <label className="block text-gray-700 font-medium mb-1"> To Godown <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={togodownName}
                  disabled={isReadOnly}
                  readOnly

                  ref={(e) => {
                    register("tobranchid").ref(e);
                    toGodownRef.current = e;
                  }}
                  onKeyDown={(e) => handleKeyOpen(e, () => setToGodownModalOpen(true))}
                  onClick={() => {
                    const toBranchIdValue = watch("tobranchid");
                    if (!toBranchIdValue || toBranchIdValue === 0) {
                      toast.error("Please select To Branch first");
                      return;
                    }
                    setToGodownModalOpen(true);
                  }}
                  className={`inputField w-full cursor-pointer 
                    ${errors?.togodownid ? "border-red-500" : "border-gray-400"} 
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Select To Godown"
                />
                {errors?.togodownid && (<p className="text-xs text-red-500 mt-1">{errors.togodownid.message}</p>)}
              </div>
            </div>
          </section>

          {/* Item Details */}
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                Item Details
              </h2>

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() =>
                    append({
                      tag: "I",
                      dtlid: fields.length + 1,
                      productid: 0,
                      qty: 0
                    })
                  }
                  className="primary-btn text-xs px-3 py-1"
                >
                  + Add Item
                </button>
              )}
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <RequisitionItems
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  remove={remove}
                  watchedItems={watchedItems}
                  userId={userId}
                  companyId={companyId}
                  branchId={toolbarBranchId}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center border-t pt-3">
              <div className="w-96" />
              <div className="w-92" />
              <div className="w-28 relative">
                <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total Qty
                </span>
                <input
                  type="number"
                  value={totalQty}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>
            </div>
          </section>

          {/* Remarks */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Remarks
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Remark 1</label>
                <input
                  {...register("rem1")}
                  placeholder="Remark 1"
                  disabled={isReadOnly}
                  className="inputField border-gray-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Remark 2</label>
                <input
                  {...register("rem2")}
                  placeholder="Remark 2"
                  disabled={isReadOnly}
                  className="inputField border-gray-400"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getButtonLabel()}
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
          visible={isSubmitting || isLoadingRequisition}
          showIndicator
        />

        <SearchModal
          open={toBranchModalOpen}
          onClose={() => setToBranchModalOpen(false)}
          endpoint="branch"
          baseParams={baseSearchParams}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToBranchSelect}
        // excludeIds={[Number(toolbarBranchId)]}
        />

        <SearchModal
          open={godownModalOpen}
          onClose={() => setGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{ ...baseSearchParams, branchid: toolbarBranchId }}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleFromGodownSelect}
        />

        <SearchModal
          open={toGodownModalOpen}
          onClose={() => setToGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{ ...baseSearchParams, branchid: (watch("tobranchid") ?? toolbarBranchId) }}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToGodownSelect}
          excludeIds={[Number(fromGodownId)]}
        />

      </form>
    </Popup>
  );
}