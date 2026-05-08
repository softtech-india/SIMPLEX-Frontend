'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useGoodReceivedNoteById, useCreateGoodReceivedNote, useUpdateGoodReceivedNote, useDeleteGoodReceivedNote, useCreateConfirmGrn } from "../hooks/useGoodReceivedNote";
import { fetchGodownList, fetchVendorList } from "@/api/master/ledger-api";
import { ConfirmGrn, ConfirmGrnType, ConfirmItems, GoodReceivedNoteFormType, OperationMode } from "../types/goodReceivedNote.types";
import { GoodReceivedNoteFormSchema, ConfirmGoodReceivedNoteFormSchema } from "../schemas/goodReceivedNote.schema";
import { goodReceivedNoteFormDefaults } from "../constants/goodReceivedNoteFormDefaults";
import { useGoodReceivedNoteForm } from "../hooks/useGoodReceivedNoteForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { GoodReceivedNoteItems } from "./GoodReceivedNoteItems";
import { useWatch } from "react-hook-form";
import { formatDate, formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useQrScanner } from "@/hooks/useQrScanner";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";


interface GoodReceivedNoteProps {
  visible: boolean;
  onClose: () => void;
  formGoodReceivedNoteId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
  isRowConfirmed: boolean;
}

type GrnPendingRow = {
  id: number;
  orderno: string;
  orderdt: string;
};

export function GoodReceivedNoteForm({ visible, onClose, formGoodReceivedNoteId, mode, formSelectedBranch, toolbarBranchId, isRowConfirmed }: GoodReceivedNoteProps) {

  // hooks
  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const confirmDelete = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isConfiemMode = mode === "Confirmed";
  const isReadOnly = mode === "View" || mode === "Print" || mode === "Confirmed";

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

  const [grnPendingModalOpen, setGrnPendingModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);

  const { data: GoodReceivedNote, isLoading: isLoadingGoodReceivedNote } =
    useGoodReceivedNoteById({
      id: formGoodReceivedNoteId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateGoodReceivedNote();
  const updateMutation = useUpdateGoodReceivedNote();
  const deleteMutation = useDeleteGoodReceivedNote();
  const confirmMutation = useCreateConfirmGrn();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || confirmMutation.isPending;


  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useGoodReceivedNoteForm();

  const orderid = watch("orderid");
  const orderno = watch("orderno");
  const orderdt = watch("orderdt");
  const vendorid = watch("vendorid");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemdtl",
  });

  // Calculate Total Quantity and Vlaue
  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  }) || [];
  // console.log(' watchedItems ', watchedItems);
  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty1) || 0);
  }, 0) || 0;

  const totalValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.qty1) || 0;
    const rate = Number(item?.rate) || 0;
    return sum + qty * rate;
  }, 0) || 0;

  const totalScanQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.scanqty) || 0);
  }, 0) || 0;

  const totalScanValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.scanqty) || 0;
    const rate = Number(item?.rate) || 0;
    return sum + qty * rate;
  }, 0) || 0;

  const { scanInputRef, handleScan } = useQrScanner({
    watchedItems,
    setValue,
    onUpdateItems: (items) => {
      setValue("itemdtl", items, { shouldValidate: true });
    },
  });


  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("orderdt");
    }, 1000);

    if (isAddMode) {
      reset(goodReceivedNoteFormDefaults);
      return;
    }

    if (GoodReceivedNote) {
      reset({
        ...goodReceivedNoteFormDefaults,

        ...GoodReceivedNote,

        compid: Number(GoodReceivedNote.compid ?? 0),
        branchid: Number(GoodReceivedNote.branchid ?? 0),
        finid: Number(finid ?? 0),
        vnumid: Number(GoodReceivedNote.vnumid ?? 0),
        vendorid: Number(GoodReceivedNote.vendorid ?? 0),
        vendornm: GoodReceivedNote.vendornm,

        qty1: Number(GoodReceivedNote.qty1 ?? 0),
        qty2: Number(GoodReceivedNote.qty2 ?? 0),

        totprodval: Number(GoodReceivedNote.totprodval ?? 0),
        isconfirm: GoodReceivedNote.isconfirm ?? "",

        grndt: GoodReceivedNote.grndt ? formatDateForInput(GoodReceivedNote.grndt) : "",
        grnno: GoodReceivedNote.grnno ?? "",

        partyrefno: GoodReceivedNote.partyrefno ?? "",
        partyrefdt: GoodReceivedNote.partyrefdt ? formatDateForInput(GoodReceivedNote.partyrefdt) : "",

        godownid: Number(GoodReceivedNote.godownid ?? 0),
        godownnm: GoodReceivedNote.godownnm,

        ordertype: GoodReceivedNote.ordertype ?? "",
        orderid: Number(GoodReceivedNote.orderid ?? 0),

        narration: GoodReceivedNote.narration ?? "",

        itemdtl:
          GoodReceivedNote.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            pcategoryid: item.pcategoryid,
            pcategorynm: item.pcategorynm,
            productid: item.productid,
            productnm: item.productnm,
            qty1: Number(item.qty1 ?? 0),
            qty2: Number(item.qty2 ?? 0),
            rate: Number(item.rate ?? 0),
            value: Number(item.value ?? 0),
            unit: item.unit,
            balanceqty1: item?.balanceqty1,
            confirmqty1: item?.confirmqty1,
            altunimethod: item.altunimethod ?? "A",
            altunitfactor: Number(item.altunitfactor ?? 1),
            alterunitfactortype: item.alterunitfactortype ?? "M",
            rateon: Number(item.rateon ?? 1),
            orderdtlid: item.orderdtlid || 0,
            scanqty: item.scanqty || 0,
            shortqty: item.shortqty || 0,
            excessqty: item.excessqty || 0,
            actualprodval: item.actualprodval || 0,
          })) ?? [],
      });
    }
  }, [GoodReceivedNote, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "GRN";
  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: ["fetchSeriesList", userId, companyId, toolbarBranchId, voucherType],
    queryFn: () => fetchSeriesList(userId, companyId, toolbarBranchId, voucherType, finid),
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

      // auto-set first option safely
      setTimeout(() => {
        if (options.length > 0) {
          setValue("vnumid", options[0].value);
        }
      }, 0);

      return options;
    },
  });

  const selectedSeries = seriesNoOptions.find(
    (s: any) => s.value === watch("vnumid")
  );

  // Model Search Vendor Modal Handlers
  const baseVendorParams = {
    userid: userId,
    compid: companyId,
  };

  const searchVendorColumns = [
    { key: "name", label: "name." },
  ];

  const searchVendorFields = [
    { value: "name", label: "Name" },
  ];

  const handleVendorSelect = (row: any) => {
    setValue("vendorid", row.id);
    setValue("vendorName", row.name);
    setVendorModalOpen(false);
  };

  const vendorName = watch("vendorName") || watch("vendornm");

  // Model Search Godown Modal Handlers
  const baseGodownParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId
  };

  const searchGodownColumns = [
    { key: "name", label: "name." },
  ];

  const searchGodownFields = [
    { value: "name", label: "Name" },
  ];

  const handleGodownSelect = (row: any) => {
    setValue("godownid", row.id);
    setValue("godownName", row.name);
    setVendorModalOpen(false);
  };

  const godownName = watch("godownName") || watch("godownnm");

  // Model Search GrnPending Modal Handlers
  const baseGrnPendingParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId,
    finid: finid,
    vendorid: vendorid,
  };

  const searchGrnPendingColumns = [
    { key: "orderno", label: "Order No." },
    { key: "orderdt", label: "Order Date." },
  ];

  const searchGrnPendingFields = [
    { value: "name", label: "Name" },
  ];

  const handleGrnPendingSelect = (row: GrnPendingRow) => {
    setValue("orderid", row.id);
    setValue(`orderno`, row.orderno);
    setValue(`orderdt`, row.orderdt);
    setGrnPendingModalOpen(false);
  };


  const calculateTotals = (items: any[] = []) => {
    let qty1 = 0;
    let totprodval = 0;

    const itemdtl = items.map((item, index) => {
      const qty = Number(item?.qty1) || 0;
      const rate = Number(item?.rate) || 0;
      const value = qty * rate;

      qty1 += qty;
      totprodval += value;

      return {
        tag: item?.tag || "I",
        dtlid: item?.dtlid || index + 1,
        productid: Number(item.productid ?? 0),
        qty1: Number(qty),
        qty2: Number(item?.qty2) || qty,
        rate: Number(rate),
        value: value,
        unit: item?.unit,
        balanceqty1: item?.balanceqty1,
        confirmqty1: item?.confirmqty1,
        altunimethod: item?.altunimethod || "A",
        altunitfactor: item?.altunitfactor || 1,
        alterunitfactortype: item?.alterunitfactortype || "M",
        rateon: item?.rateon || 1,
        orderdtlid: item?.orderdtlid || 0,
      };
    });

    return { qty1, totprodval, itemdtl };
  };

  // Submit handler
  const handleConfirm = async () => {
    try {
      const proceedSave = async () => {
        const confirmItems: ConfirmItems[] = (watchedItems || []).map((item: any) => ({
          tag: item.tag || "I",
          dtlid: item.dtlid,
          productid: item.productid,
          qty1: Number(item.scanqty) || 0,
        }));

        const confirmPayload: ConfirmGrn = {
          id: formGoodReceivedNoteId,
          compid: Number(companyId),
          qty1: totalScanQty,
          totprodval: totalScanValue,
          itemdtl: confirmItems,
        };

        await confirmMutation.mutateAsync(confirmPayload);

        onClose();
      };

      if (!totalScanQty || totalScanQty === 0) {
        toast.error("Scanned quantity is 0. Cannot proceed with save.");
        return;
      }
      if (totalScanQty < totalQty) {
        toast.warning(
          `Scanned quantity (${totalScanQty}) is less than total quantity (${totalQty}). Do you want to continue?`,
          {
            action: (
              <div className="flex gap-2">
                <button
                  onClick={proceedSave}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Continue
                </button>

                <button
                  onClick={() => { }}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            ),
          }
        );

        return;
      }

      await proceedSave();

    } catch (error) {
      console.error("Confirm error:", error);
      toast.error("Something went wrong while confirming");
    }
  };

  const handleFormSubmit = async (data: GoodReceivedNoteFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Good Received Note",
          message: "Are you sure you want to delete this GRN?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formGoodReceivedNoteId,
          userid: Number(userId),
          compid: Number(companyId),
          branchid: toolbarBranchId,
          finid: Number(finid),
        });
        onClose();
        return;
      }

      const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: GoodReceivedNoteFormType = {
        ...data,
        compid: companyId,
        branchid: toolbarBranchId,
        qty1: Number(qty1),
        qty2: Number(qty1),
        totprodval: totprodval,
        itemdtl,

      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(goodReceivedNoteFormDefaults);
        onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formGoodReceivedNoteId,
          data: payload,
        });
        onClose();
      }

      if (isConfiemMode) {
        await handleConfirm();
        return;
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter(Boolean);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      if (isConfiemMode) return "Confirming...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    if (isConfiemMode) return "Confirm";
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
      title={`${mode} Good Received Note : ${formSelectedBranch}`}
      width="90vw"
      height="90vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Good Received Note Information
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
                  isDisabled={selectedSeries?.manualallow === "N" || isReadOnly}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">GRN Date</label>
                <input
                  type="date"
                  {...register("grndt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.grndt ? "text-red-500" : "border-gray-300"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">GRN No</label>
                <input
                  type="text"
                  {...register("grnno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`
                    inputField 
                    ${errors.grnno ? "border-red-500" : "border-gray-300"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1">Vendor <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={vendorName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setVendorModalOpen(true)}
                  className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                  placeholder="Select Vendor"
                />
              </div>

              <div className="w-68">
                <label className="block text-gray-700 font-medium mb-1">PO No. & Date <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={orderno ? `${orderno} - ${formatDate(orderdt)}` : ""}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setGrnPendingModalOpen(true)}
                  className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                  placeholder="Select PO No. & Date"
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Party Ref. No</label>
                <input
                  type="text"
                  {...register("partyrefno")}
                  disabled={isReadOnly}
                  placeholder="Enter party ref. no."
                  className={`inputField ${errors.partyrefno ? "" : "border-gray-300"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Party Ref. Date</label>
                <input
                  type="date"
                  {...register("partyrefdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.partyrefdt ? "text-red-500" : "border-gray-300"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1"> Godown <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={godownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setGodownModalOpen(true)}
                  className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                  placeholder="Select Godown"
                />
              </div>

              {(mode === 'Confirmed') && (
                <>
                  <div className="w-48 ">
                    <label className="block text-gray-700 font-medium mb-1">
                      Scan QR Code <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      {...register("qrcode")}
                      ref={(el) => {
                        scanInputRef.current = el;
                        register("qrcode").ref(el);
                      }}
                      className="inputField border-gray-300"
                      onKeyDown={(e: any) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        handleScan(e.target.value);
                      }}
                    />

                  </div>
                </>
              )}

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
                      qty1: 0,
                      qty2: 0,
                      rate: 0,
                      value: 0,
                      altunimethod: "A",
                      altunitfactor: 1,
                      alterunitfactortype: "M",
                      rateon: 1,
                      orderdtlid: 0,
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
                <GoodReceivedNoteItems
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  remove={remove}
                  mode={mode}
                  watchedItems={watchedItems}
                  isRowConfirmed={isRowConfirmed}
                  userId={userId}
                  companyId={companyId}
                  branchId={toolbarBranchId}
                  finid={finid}
                  orderid={orderid || 0}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}

                  excludeIds={selectedProductIds}
                  currentId={watchedItems?.[index]?.productid}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center border-t pt-3">

              <div className="w-68" />

              <div className="w-80" />

              <div className="w-20 relative">
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

              <div className="w-24 relative">
                <input
                  type="number"
                  value={totalValue}
                  readOnly
                  className="inputField w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              {(mode === 'Confirmed') && (
                <>
                  <div className="w-14 relative">
                    <input
                      type="number"
                      value={totalScanQty}
                      readOnly
                      className="inputField w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="w-14 relative"></div>
                  <div className="w-14 relative"></div>
                  <div className="w-20 relative">
                    <input
                      type="number"
                      value={totalScanValue}
                      readOnly
                      className="inputField w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </>
              )}

              <div className="w-12" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Narration </label>
                <input
                  {...register("narration")}
                  placeholder="Narration"
                  disabled={isReadOnly}
                  className={`inputField ${errors.narration ? "" : "border-gray-300"} ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} disabled:opacity-50 disabled:cursor-not-allowed`}
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
          visible={isSubmitting || isLoadingGoodReceivedNote}
          showIndicator
        />
      </form>


      <SearchModal
        open={vendorModalOpen}
        onClose={() => setVendorModalOpen(false)}
        endpoint="vendor"
        baseParams={baseVendorParams}
        columns={searchVendorColumns}
        searchFields={searchVendorFields}
        onSelect={handleVendorSelect}
      />

      <SearchModal
        open={grnPendingModalOpen}
        onClose={() => setGrnPendingModalOpen(false)}
        endpoint="po/pendinglist"
        baseParams={baseGrnPendingParams}
        columns={searchGrnPendingColumns}
        searchFields={searchGrnPendingFields}
        onSelect={handleGrnPendingSelect}
        excludeIds={selectedProductIds}
      />

      <SearchModal
        open={godownModalOpen}
        onClose={() => setGodownModalOpen(false)}
        endpoint="godown"
        baseParams={baseGodownParams}
        columns={searchGodownColumns}
        searchFields={searchGodownFields}
        onSelect={handleGodownSelect}
      />

    </Popup>
  );


}