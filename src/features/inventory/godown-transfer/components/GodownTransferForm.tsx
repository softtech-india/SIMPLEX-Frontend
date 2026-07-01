'use client';

import { useEffect, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { LoadPanel } from "devextreme-react";
import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  useGodownTransferById,
  useCreateGodownTransfer,
  useUpdateGodownTransfer,
  useDeleteGodownTransfer,
} from "../hooks/useGodownTransfer";
import { GodownTransferFormSchema, } from "../schemas/godownTransfer.schema";
import { godownTransferFormDefaults, } from "../constants/godownTransferFormDefaults";
import { useGodownTransferForm, } from "../hooks/useGodownTransferForm";
import { godownTransferService, } from "../services/godownTransferService";
import { OperationMode, } from "../types/godowntransfer.types";
import { FormSelect } from "@/common/components/FormSelect";
import SearchModal from "@/common/components/SearchModal";
import { GodownTransferItems } from "./GodownTransferItems";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { formatDateForInput } from "@/helpers/dateUtils";
import { useConfirm } from "@/common/hooks/useConfirm";

interface GodownTransferFormProps {
  visible: boolean;
  onClose: () => void;
  formGodownTransferId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function GodownTransferForm({ visible, onClose, formGodownTransferId, mode, formSelectedBranch, toolbarBranchId, }: GodownTransferFormProps) {

  // Hooks
  const { userId, companyId, branchId, finid, } = useUserStore();
  const confirmDelete = useConfirm();

  // States
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [toGodownModalOpen, setToGodownModalOpen] = useState(false);
  const [toBranchModalOpen, setToBranchModalOpen] = useState(false);
  const [pendingReqModalOpen, setPendingReqModalOpen] = useState(false);

  // Derived States
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  // Queries
  const { data: godownTransfer, isLoading: isLoadingGodownTransfer, } =
    useGodownTransferById({
      id: formGodownTransferId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  // Mutations
  const createMutation = useCreateGodownTransfer();
  const updateMutation = useUpdateGodownTransfer();
  const deleteMutation = useDeleteGodownTransfer();

  // Combined loading state for mutations
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const { control, register, handleSubmit, setFocus, reset, watch, setValue, formState: { errors }, } = useGodownTransferForm();

  const { fields, append, remove, replace, } = useFieldArray({
    control,
    name: "itemdtl",
  });

  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  }) || [];

  const totalQty = watchedItems.reduce((sum, item) => {
    return sum + (Number(item?.qty) || 0);
  }, 0);

  const totalValue = watchedItems.reduce((sum, item) => {
    return sum + (Number(item?.value) || 0);
  }, 0);

  const handleExit = () => {
    reset(godownTransferFormDefaults);
    replace([]);
    onClose();
  };

  // Reset 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("gtdt");
    }, 500);

    if (isAddMode) {
      reset(godownTransferFormDefaults);
      return;
    }

    if (godownTransfer) {
      reset({
        ...godownTransferFormDefaults,
        ...godownTransfer,
        compid: Number(godownTransfer.compid ?? 0),
        branchid: Number(godownTransfer.branchid ?? 0),
        finid: Number(godownTransfer.finid ?? 0),
        vnumid: Number(godownTransfer.vnumid ?? 0),
        vnummethod: godownTransfer.vnummethod ?? "A",
        reqdt: godownTransfer.reqdt ? formatDateForInput(godownTransfer.reqdt) : "",
        gtdt: godownTransfer.gtdt ? formatDateForInput(godownTransfer.gtdt) : "",
        reqno: godownTransfer.reqno ?? "",
        gtno: godownTransfer.gtno ?? "",
        godownid: Number(godownTransfer.godownid ?? 0),
        godownnm: godownTransfer.godownnm ?? "",
        godownName: godownTransfer.godownnm ?? '',
        tobranchid: Number(godownTransfer.tobranchid ?? 0),
        tobranchnm: godownTransfer.tobranchnm ?? "",
        toBranchName: godownTransfer.tobranchnm ?? "",
        togodownid: Number(godownTransfer.togodownid ?? 0),
        togodownnm: godownTransfer.togodownnm ?? "",
        togodownName: godownTransfer.togodownnm ?? "",
        rem: godownTransfer.rem ?? "",
        reqid: Number(godownTransfer.reqid ?? 0),
        reqName: godownTransfer.reqno ?? "",
        totqty: Number(godownTransfer.totqty ?? 0),
        totval: Number(godownTransfer.totval ?? 0),
        entryby: 0,
        updateby: 0,
        itemdtl:
          godownTransfer.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            pcategoryid: item.pcategoryid ?? 0,
            pcategorynm: item.pcategorynm ?? "",
            productid: item.productid ?? 0,
            productnm: item.productnm ?? "",
            qty: Number(item.qty ?? 0),
            rate: Number(item.rate ?? 0),
            value: Number(item.value ?? 0),
            reqdtlid: Number(item.reqdtlid ?? 0),
            balanceqty: Number(item.balanceqty ?? 0),
            unit: item.unit ?? ""
          })) ?? [],
      });
    }
  }, [visible, isAddMode, godownTransfer, reset, setFocus]);


  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" },
  ];

  // Series No Options
  const voucherType = "ST";
  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: ["fetchSeriesList", userId, companyId, toolbarBranchId, voucherType,],
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

  const calculateTotals = (items: any[] = []) => {
    let totqty = 0;
    let totval = 0;

    const itemdtl = items.map((item, index) => {
      const qty = Number(item.qty ?? 0);
      const rate = Number(item.rate ?? 0);
      const value = qty * rate;

      totqty += qty;
      totval += value;

      return {
        tag: item.tag ?? "I",
        dtlid: item.dtlid ?? index + 1,
        productid: Number(item.productid ?? 0),
        qty,
        rate,
        value,
        reqdtlid: Number(item.reqdtlid ?? 0),
        pcategoryid: Number(item.pcategoryid ?? 0),
        pcategorynm: item.pcategorynm ?? "",
        productnm: item.productnm ?? "",
        unit: item.unit ?? "",
      };
    });

    return { totqty, totval, itemdtl, };
  };

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
    setValue("tobranchid", row.id);
    setValue("toBranchName", row.name);
    setValue("tobranchnm", row.name);
    setToBranchModalOpen(false);
    setValue("togodownid", 0);
    setValue("togodownName", "");
    setValue("togodownnm", "");
    setValue("reqid", 0);
    setValue("reqno", "");
    setValue("reqName", "");
    replace([{
      tag: "I",
      dtlid: 1,
      productid: 0,
      qty: 0,
      balanceqty: 0,
      rate: 0,
      value: 0,
      reqdtlid: 0,
    }]);
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
    setValue("godownnm", row.name);
    setGodownModalOpen(false);
    setValue("togodownid", 0);
    setValue("togodownName", '');
    setValue("togodownnm", '');
  };
  const fromGodownId = watch("godownid");
  const fromGodownName = watch("godownName");

  // To Godown Modal Handler
  const handleToGodownSelect = (row: any) => {
    setValue("togodownid", row.id);
    setValue("togodownName", row.name);
    setValue("togodownnm", row.name);
    setToGodownModalOpen(false);
  };

  const togodownName = watch("togodownName");

  // Open Pending Rquisition Modal Handler
  const handleOpenPendingReq = () => {
    if (isReadOnly) return;

    const toBranchId = watch("tobranchid");
    const godownId = watch("godownid");

    if (!toBranchId || toBranchId === 0) {
      toast.error("Please select To Branch first");
      return;
    }

    if (!godownId || godownId === 0) {
      toast.error("Please select From Godown first");
      return;
    }

    setPendingReqModalOpen(true);
  };

  const handlePendingReqSelect = (row: any) => {
    setValue("reqid", row.id);
    setValue("reqno", row.reqno);
    setValue("reqName", String(row.reqno));
    setPendingReqModalOpen(false);

    if (row.items && row.items.length > 0) {
      const transformedItems = row.items.map((item: any, index: number) => ({
        tag: "I",
        dtlid: index + 1,
        productid: item.productid,
        productnm: item.productnm,
        pcategoryid: item.pcategoryid,
        pcategorynm: item.pcategorynm,
        qty: item.qty || 0,
        rate: item.rate || 0,
        value: (item.qty || 0) * (item.rate || 0),
        balanceqty: item.balanceqty || 0,
        reqdtlid: item.dtlid,
        unit: item.unit || ""
      }));
      replace(transformedItems);
    } else {
      replace([{
        tag: "I",
        dtlid: 1,
        productid: 0,
        qty: 0,
        rate: 0,
        value: 0,
        reqdtlid: 0,
      }]);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Godown Transfer",
          message: "Are you sure you want to delete this Godown Transfer?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formGodownTransferId,
          userid: Number(userId),
          compid: Number(companyId),
        });

        toast.success("Godown Transfer deleted successfully");
        onClose();
        return;
      }

      // For ADD and EDIT modes, validate and prepare full payload
      const items = data.itemdtl || [];
      if (items.length === 0 || items.every((item: any) => !item.productid || !item.qty)) {
        toast.error("Please add at least one valid item");
        return;
      }

      const { totqty, totval, itemdtl } = calculateTotals(items);

      const payload: GodownTransferFormSchema = {
        ...data,
        compid: Number(companyId),
        branchid: Number(toolbarBranchId),
        finid: Number(finid),
        totqty,
        totval,
        itemdtl,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        toast.success("Godown Transfer created successfully");
        reset(godownTransferFormDefaults);
        // onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formGodownTransferId,
          data: payload,
        });
        toast.success("Godown Transfer updated successfully");
        onClose();
        return;
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "An error occurred while saving");
    }
  };

  const reqName = watch("reqName");

  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter((id: number) => id && id !== 0) || [];

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isEditMode) return "Editing...";
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }
    if (isDeleteMode) return "Delete";
    return "Save";
  };

  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Godown Transfer`}
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
        <div className="flex-1 overflow-y-auto p-1 space-y-1">
          <section className="border rounded-md p-1 shadow-sm bg-white space-y-3">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Godown Transfer Information
            </h2>

            <div className="flex flex-wrap gap-1 items-end">
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
                <label className="block text-gray-700 font-medium mb-1">Transfer Date</label>
                <input
                  type="date"
                  {...register("gtdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.gtdt ? "border-red-500" : "border-gray-400"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>
              <div className="w-100">
                <label className="block text-gray-700 font-medium mb-1">Remarks</label>
                <input
                  type="text"
                  {...register("rem")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.rem ? "border-red-500" : "border-gray-400"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Enter Remarks"
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

          <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Transfer Details
            </h2>

            <div className="flex flex-wrap gap-1 items-end">

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1"> From Godown <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={fromGodownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => { setGodownModalOpen(true); }}
                  className={`inputField w-full cursor-pointer 
                    ${errors?.godownid ? "border-red-500" : "border-gray-400"} 
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Select Godown"
                />
                {/* {errors?.godownid && (<p className="text-xs text-red-500 mt-1">{errors.godownid.message}</p>)} */}
              </div>

              {/* <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1">  To Branch <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={toBranchName || ''}
                  disabled={isReadOnly}
                  onClick={() => { setToBranchModalOpen(true); }}
                  tabIndex={-1}
                  readOnly
                  className={`inputField w-full cursor-pointer
                    ${errors?.tobranchid ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Select Branch"
                />
                {errors?.tobranchid && (<p className="text-xs text-red-500 mt-1">{errors.tobranchid.message}</p>)}
              </div> */}

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1"> To Godown <span className="text-red-500"> * </span> </label>
                <input
                  type="text"
                  value={togodownName}
                  disabled={isReadOnly}
                  readOnly
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
                {/* {errors?.togodownid && (<p className="text-xs text-red-500 mt-1">{errors.togodownid.message}</p>)} */}
              </div>

              <div className="w-76">
                <label className="block text-gray-700 font-medium mb-1"> Pending Requisition <span className="text-red-500"> * </span></label>
                <input
                  type="text"
                  value={reqName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => { handleOpenPendingReq(); }}
                  className={`inputField w-full cursor-pointer
                     ${errors?.reqno ? "border-red-500" : "border-gray-400"} 
                     ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Select Pending Requisition"
                />
                {/* {errors?.reqno && (<p className="text-xs text-red-500 mt-1">{errors.reqno.message}</p>)} */}
              </div>
            </div>
          </section>

          <section className="border rounded-md p-1 bg-white space-y-1">

            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                Item Details
              </h2>

              {!isReadOnly && !isEditMode && (
                <button
                  type="button"
                  className="primary-btn text-xs px-3 py-1"
                  onClick={() =>
                    append({
                      tag: "I",
                      dtlid: fields.length + 1,
                      productid: 0,
                      qty: 0,
                      rate: 0,
                      value: 0,
                      reqdtlid: 0,
                    })
                  }
                >
                  + Add Item
                </button>
              )}
            </div>

            <div className="space-y-1">
              {fields.map((field, index) => (
                <GodownTransferItems
                  key={field.id}
                  index={index}
                  field={field}
                  reqid={Number(watch("reqid"))}
                  control={control}
                  register={register}
                  errors={errors}
                  remove={remove}
                  setValue={setValue}
                  watchedItems={watchedItems}
                  userId={userId}
                  companyId={companyId}
                  branchId={toolbarBranchId}
                  finid={finid}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}
                  excludeIds={selectedProductIds}
                  currentId={watchedItems?.[index]?.productid}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-1 items-center border-t-2 pt-1">
              <div className="w-60" />
              <div className="w-72" />

              <div className="w-24 relative ">
                <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total
                </span>
                <input
                  type="number"
                  value={totalQty}
                  readOnly
                  className="inputField w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="w-14" />
              <div className="w-24" />
              <div className="w-28 ">
                <input
                  type="number"
                  value={totalValue}
                  readOnly
                  className="inputField w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="w-24 "></div>
            </div>
          </section>

        </div>

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
            onClick={handleExit}
            disabled={isSubmitting}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit
          </button>
        </div>

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isSubmitting || isLoadingGodownTransfer}
          showIndicator
        />

        <SearchModal
          open={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          endpoint="branch"
          baseParams={baseSearchParams}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={(row) => {
            setValue("tobranchid", row.id);
            setValue("tobranchnm", row.name);
            setValue("toBranchName", row.name);
            setValue("togodownid", 0);
            setValue("togodownnm", "");
            setBranchModalOpen(false);
          }}
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
          baseParams={{ ...baseSearchParams, branchid: watch("tobranchid") }}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToGodownSelect}
          excludeIds={[Number(fromGodownId)]}
        />

        <SearchModal
          open={toBranchModalOpen}
          onClose={() => setToBranchModalOpen(false)}
          endpoint="branch"
          baseParams={baseSearchParams}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToBranchSelect}
          excludeIds={[Number(toolbarBranchId)]}
        />

        <SearchModal
          open={pendingReqModalOpen}
          onClose={() => setPendingReqModalOpen(false)}
          endpoint="requisition/pendinglist"
          baseParams={{
            userid: userId,
            compid: companyId,
            finid: finid,
            branchid: toolbarBranchId,
            frombranchid: watch("tobranchid"),
            godownid: watch("godownid"),
          }}
          columns={[
            { key: "reqno", label: "Requisition No" },
            { key: "reqdt", label: "Requisition Date" },
          ]}
          searchFields={[
            { value: "reqno", label: "Requisition No" },
          ]}
          onSelect={handlePendingReqSelect}
        />
      </form>
    </Popup>
  );
}