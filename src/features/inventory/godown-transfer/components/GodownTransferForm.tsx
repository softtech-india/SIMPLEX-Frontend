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

import {
  GodownTransferFormSchema,
} from "../schemas/godownTransfer.schema";

import {
  godownTransferFormDefaults,
} from "../constants/godownTransferFormDefaults";

import {
  useGodownTransferForm,
} from "../hooks/useGodownTransferForm";

import {
  godownTransferService,
} from "../services/godownTransferService";

import {
  OperationMode,
} from "../types/godowntransfer.types";

import { FormSelect } from "@/common/components/FormSelect";
import SearchModal from "@/common/components/SearchModal";
import { GodownTransferItems } from "./GodownTransferItems";

import { fetchSeriesList } from "@/api/purchase/purchase-api";

import useUserStore from "@/store/userStore";

import { formatDateForInput } from "@/helpers/dateUtils";

interface GodownTransferFormProps {
  visible: boolean;
  onClose: () => void;
  formGodownTransferId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function GodownTransferForm({
  visible,
  onClose,
  formGodownTransferId,
  mode,
  formSelectedBranch,
  toolbarBranchId,
}: GodownTransferFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [toGodownModalOpen, setToGodownModalOpen] = useState(false);
  const [toBranchModalOpen, setToBranchModalOpen] = useState(false);
  const [pendingReqModalOpen, setPendingReqModalOpen] = useState(false);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const {
    data: godownTransfer,
    isLoading: isLoadingGodownTransfer,
  } = useGodownTransferById({
    id: formGodownTransferId,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: toolbarBranchId,
    finid: Number(finid),
  });

  const createMutation = useCreateGodownTransfer();
  const updateMutation = useUpdateGodownTransfer();
  const deleteMutation = useDeleteGodownTransfer();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useGodownTransferForm();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "itemdtl",
  });

  const watchedItems =
    useWatch({
      control,
      name: "itemdtl",
    }) || [];

  const totalQty = watchedItems.reduce((sum, item) => {
    return sum + (Number(item?.qty) || 0);
  }, 0);

  const totalValue = watchedItems.reduce((sum, item) => {
    return sum + (Number(item?.value) || 0);
  }, 0);

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
        reqdt: godownTransfer.reqdt
          ? formatDateForInput(godownTransfer.reqdt)
          : "",
        gtdt: godownTransfer.gtdt
          ? formatDateForInput(godownTransfer.gtdt)
          : "",
        reqno: Number(godownTransfer.reqno) ?? 0,
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
        totqty: Number(godownTransfer.totqty ?? 0),
        totval: Number(godownTransfer.totval ?? 0),
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
          })) ?? [],
      });
    }

  }, [
    visible,
    isAddMode,
    godownTransfer,
    reset,
    setFocus,
  ]);

  const voucherType = "ST";

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" },
  ];

  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: [
      "fetchSeriesList",
      userId,
      companyId,
      toolbarBranchId,
      voucherType,
    ],

    queryFn: () =>
      fetchSeriesList(
        userId,
        companyId,
        toolbarBranchId,
        voucherType,
        finid
      ),

    enabled:
      !!companyId &&
      !!toolbarBranchId &&
      !!userId &&
      !!visible,

    staleTime: 0,

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

  // Search Modal Handlers
  const baseSearchParams = {
    userid: userId,
    compid: companyId,
  };

  const searchColumns = [
    { key: "name", label: "Name" },
  ];

  const searchReqColumns = [
    { key: "reqno", label: "Requisition No" },
    { key: "reqdt", label: "Requisition Date" },
  ];

  const searchFields = [
    { value: "name", label: "Name" },
  ];

  const { data: BranchOptionsArray = [] } = useQuery({
    queryKey: ["branchOptions"],

    queryFn: () =>
      godownTransferService.getAllBranches(),

    enabled: !!visible,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });
  const BranchOptionsMap = new Map(
    BranchOptionsArray.map(option => [Number(option.value), option.label])
  );
  const currentBranchId = toolbarBranchId;
  const currentBranchName = formSelectedBranch || BranchOptionsMap.get(Number(toolbarBranchId)) || "";

  const {
    data: godownOptions = [],
    isLoading: isLoadingGodowns,
  } = useQuery({
    queryKey: ["godownOptions", currentBranchId],

    queryFn: () =>
      godownTransferService.getAllGodowns(
        currentBranchId
      ),

    enabled:
      !!visible &&
      !!currentBranchId,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

  const currentToBranchId = watch("tobranchid");

  const {
    data: toGodownOptions = [],
    isLoading: isLoadingToGodowns,
  } = useQuery({
    queryKey: ["toGodownOptions", currentToBranchId],

    queryFn: () =>
      godownTransferService.getAllGodowns(
        currentToBranchId
      ),

    enabled:
      !!visible &&
      !!currentToBranchId,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

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
      };
    });

    return {
      totqty,
      totval,
      itemdtl,
    };
  };

  const handleGodownSelect = (row: any) => {
    setValue("godownid", row.id);
    setValue("godownName", row.name);
    setGodownModalOpen(false);
  };

  // To Branch Modal Handler
  const handleToBranchSelect = (row: any) => {
    setValue("tobranchid", row.id);
    setValue("toBranchName", row.name); // This should already be there
    setToBranchModalOpen(false);
    setValue("togodownid", 0);
    setValue("togodownName", ""); // Clear to godown name when branch changes
  };

  const handleToGodownSelect = (row: any) => {

    setValue("togodownid", row.id);
    setValue("togodownName", row.name);
    setToGodownModalOpen(false);
  };


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
    setValue("reqName", row.reqno);
    setPendingReqModalOpen(false);

    if (row.items && row.items.length > 0) {
      const transformedItems = row.items.map((item: any, index: number) => ({
        tag: "I",
        dtlid: index + 1,
        productid: item.productid,
        productnm: item.productnm,
        qty: item.qty,
        rate: item.rate,
        value: item.qty * item.rate,
        reqdtlid: item.dtlid
      }));

      setValue("itemdtl", transformedItems);
    }
  };


  const handleFormSubmit = async (
    data: GodownTransferFormSchema
  ) => {

    try {

      if (isDeleteMode) {

        if (
          !window.confirm(
            "Delete this Godown Transfer?"
          )
        ) return;

        await deleteMutation.mutateAsync(
          formGodownTransferId
        );

        onClose();

        return;
      }

      const {
        totqty,
        totval,
        itemdtl,
      } = calculateTotals(data.itemdtl || []);

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

        reset(godownTransferFormDefaults);

        onClose();

        return;
      }

      if (isEditMode) {

        await updateMutation.mutateAsync({
          id: formGodownTransferId,

          data: payload,

        });

        onClose();

        return;
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const isLoading =
    isLoadingGodownTransfer ||
    isLoadingGodowns ||
    isLoadingToGodowns;

  const godownName = watch("godownName");
  const toBranchName = watch("toBranchName");
  const togodownName = watch("togodownName");
  const reqName = watch("reqName");


  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter((id: number) => id && id !== 0) || [];

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
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col h-full"
      >

        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Godown Transfer Information
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
                <label className="block text-gray-700 font-medium mb-1">Branch</label>
                <input
                  type="text"
                  value={currentBranchName}
                  readOnly
                  className="inputField border-gray-400 bg-gray-100"
                />
              </div>
            </div>
          </section>

          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Transfer Details
            </h2>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1">
                  From Godown <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={godownName || ''}
                  readOnly
                  onClick={() => {
                    if (!isReadOnly) setGodownModalOpen(true);
                  }}
                  className={`inputField w-full cursor-pointer ${errors?.godownid
                    ? "border-red-500"
                    : "border-gray-400"
                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Select Godown"
                />
                {errors?.godownid && (
                  <p className="text-xs text-red-500 mt-1">{errors.godownid.message}</p>
                )}
              </div>

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1">
                  To Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={toBranchName || ''}
                  readOnly
                  onClick={() => {
                    if (!isReadOnly) setToBranchModalOpen(true);
                  }}
                  className={`inputField w-full cursor-pointer ${errors?.tobranchid
                    ? "border-red-500"
                    : "border-gray-400"
                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Select Branch"
                />
                {errors?.tobranchid && (
                  <p className="text-xs text-red-500 mt-1">{errors.tobranchid.message}</p>
                )}
              </div>

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1">
                  To Godown <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={togodownName}
                  readOnly
                  onClick={() => {
                    if (isReadOnly) return;
                    const toBranchIdValue = watch("tobranchid");
                    if (!toBranchIdValue || toBranchIdValue === 0) {
                      toast.error("Please select To Branch first");
                      return;
                    }
                    setToGodownModalOpen(true);
                  }}
                  className={`inputField w-full cursor-pointer ${errors?.togodownid
                    ? "border-red-500"
                    : "border-gray-400"
                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Select To Godown"
                />
                {errors?.togodownid && (
                  <p className="text-xs text-red-500 mt-1">{errors.togodownid.message}</p>
                )}
              </div>
              <div className="w-76">
                <label className="block text-gray-700 font-medium mb-1">
                  Pending Requisition <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reqName}
                  readOnly
                  onClick={handleOpenPendingReq}
                  className={`inputField w-full cursor-pointer ${errors?.reqno
                    ? "border-red-500"
                    : "border-gray-400"
                    } ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Select Pending Requisition"
                />
                {errors?.togodownid && (
                  <p className="text-xs text-red-500 mt-1">{errors.togodownid.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="border rounded-md p-3 bg-white space-y-3">

            <div className="flex justify-between items-center">

              <h2 className="text-sm font-semibold">
                Item Details
              </h2>

              {!isReadOnly && (
                <button
                  type="button"
                  className="primary-btn"
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
                excludeIds={selectedProductIds} // Pass all selected product IDs
                currentId={watchedItems?.[index]?.productid} // Pass current product ID
              />
            ))}

            <div className="flex justify-end gap-4 border-t pt-3">

              <div className="w-32">
                <label>Total Qty</label>

                <input
                  value={totalQty}
                  readOnly
                  className="inputField bg-gray-100"
                />
              </div>

              <div className="w-32">
                <label>Total Value</label>

                <input
                  value={totalValue}
                  readOnly
                  className="inputField bg-gray-100"
                />
              </div>

            </div>

          </section>

          <section className="border rounded-md p-3 bg-white">

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label>Remark</label>

                <input
                  {...register("rem")}
                  disabled={isReadOnly}
                  className="inputField"
                />
              </div>

              <div>
                <label>Remark 2</label>

                <input
                  {...register("rem2")}
                  disabled={isReadOnly}
                  className="inputField"
                />
              </div>

            </div>

          </section>

        </div>

        <div className="border-t p-2 flex justify-end gap-4">

          {!isReadOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="secondary-btn"
          >
            Exit
          </button>

        </div>

        <LoadPanel
          visible={!!(isSubmitting || isLoading)}
          shadingColor="rgba(0,0,0,0.4)"
          showIndicator
        />

        <SearchModal
          open={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          endpoint="branch"
          baseParams={{
            userid: userId,
            compid: companyId,
          }}
          columns={[
            {
              key: "name",
              label: "Name",
            },
          ]}
          searchFields={[
            {
              value: "name",
              label: "Name",
            },
          ]}
          onSelect={(row) => {

            setValue("tobranchid", row.id);
            setValue("tobranchnm", row.name);

            setValue("togodownid", 0);
            setValue("togodownnm", "");

            setBranchModalOpen(false);
          }}
        />

        <SearchModal
          open={godownModalOpen}
          onClose={() => setGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{
            userid: userId,
            compid: companyId,
            branchid: toolbarBranchId,
          }}
          columns={[
            {
              key: "name",
              label: "Name",
            },
          ]}
          searchFields={[
            {
              value: "name",
              label: "Name",
            },
          ]}
          onSelect={(row) => {

            setValue("godownid", row.id);
            setValue("godownnm", row.name);

            setGodownModalOpen(false);
          }}
        />

        <SearchModal
          open={toGodownModalOpen}
          onClose={() => setToGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{
            userid: userId,
            compid: companyId,
            branchid: watch("tobranchid"),
          }}
          columns={[
            {
              key: "name",
              label: "Name",
            },
          ]}
          searchFields={[
            {
              value: "name",
              label: "Name",
            },
          ]}
          onSelect={(row) => {

            setValue("togodownid", row.id);
            setValue("togodownnm", row.name);

            setToGodownModalOpen(false);
          }}
        />

        <SearchModal
          open={toBranchModalOpen}
          onClose={() => setToBranchModalOpen(false)}
          endpoint="branch"
          baseParams={baseSearchParams}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToBranchSelect}
          excludeIds={[Number(toolbarBranchId)]}  // This will now work
        />

        <SearchModal
          open={godownModalOpen}
          onClose={() => setGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{ ...baseSearchParams, branchid: toolbarBranchId }}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleGodownSelect}
        />

        <SearchModal
          open={toGodownModalOpen}
          onClose={() => setToGodownModalOpen(false)}
          endpoint="godown"
          baseParams={{ ...baseSearchParams, branchid: watch("tobranchid") }}
          columns={searchColumns}
          searchFields={searchFields}
          onSelect={handleToGodownSelect}
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