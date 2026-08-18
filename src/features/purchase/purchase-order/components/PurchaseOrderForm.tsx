'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { usePurchaseOrderById, useCreatePurchaseOrder, useUpdatePurchaseOrder, useDeletePurchaseOrder, useApprovePurchaseOrder, usePrintPurchaseOrder } from "../hooks/usePurchaseOrder";
import { PurchaseOrderFormType, OperationMode } from "../types/purchaseOrder.types";
import { PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";
import { defaultItemDtl, pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";
import { usePurchaseOrderForm } from "../hooks/usePurchaseOrderForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { PurchaseOrderItems } from "./PurchaseOrderItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import { useMasterModal } from "@/hooks/useMasterModal";
import { useLookupShortcuts } from "@/common/hooks/useLookupShortcuts";
import { LOOKUP_KEYS } from "@/common/constants/lookupKeys";
import Loader from "@/common/components/Loader";

interface PurchaseOrderFormProps {
  visible: boolean;
  onClose: () => void;
  formPurchaseOrderId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function PurchaseOrderForm({ visible, onClose, formPurchaseOrderId, mode, formSelectedBranch, toolbarBranchId }: PurchaseOrderFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const { open } = useMasterModal();
  const confirmDelete = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);
  const [vendorFormOpen, setVendorFormOpen] = useState(false);
  const proFormaRef = useRef<HTMLInputElement>(null);
  const brandInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: printPurchaseOrder, isPending: isPrinting } = usePrintPurchaseOrder();

  const handleSortcutCreate = async () => {
    await open("vendor");
  };


  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isApproveMode = mode === "Approve";
  const isReadOnly = mode === "View" || mode === "Print";

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
      [SHORTCUTS.ADDITEM]: () => { handleAddItem(); },

    },
    visible
  );

  const { data: PurchaseOrder, isLoading: isLoadingPurchaseOrder } =
    usePurchaseOrderById({
      id: formPurchaseOrderId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();
  const deleteMutation = useDeletePurchaseOrder();
  const approveMutation = useApprovePurchaseOrder();

  const isSubmitting = createMutation.isPending || approveMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = usePurchaseOrderForm(isApproveMode);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemdtl",
  });

  // Calculate Total Quantity and Vlaue
  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  }) || [];

  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty1) || 0);
  }, 0) || 0;

  const totalValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.qty1) || 0;
    const rate = Number(item?.rate) || 0;

    return sum + qty * rate;
  }, 0) || 0;

  const handleExit = () => {
    reset(pruchaseOrderFormDefaults);
    onClose();
  };

  // Reset form 
  useEffect(() => {
    if (!visible) return;



    if (isAddMode) {
      setTimeout(() => {
        setFocus("orderdt");
      }, 1000);
      return;
    }
    if (!PurchaseOrder) return;
    reset(pruchaseOrderFormDefaults);

    if (PurchaseOrder) {
      reset({
        ...pruchaseOrderFormDefaults,

        ...PurchaseOrder,

        aprvstatus: "",

        orderdt: PurchaseOrder.orderdt ? formatDateForInput(PurchaseOrder.orderdt) : "",
        enqdt: PurchaseOrder.enqdt ? formatDateForInput(PurchaseOrder.enqdt) : "",
        quotdt: PurchaseOrder.quotdt ? formatDateForInput(PurchaseOrder.quotdt) : "",

        compid: Number(PurchaseOrder.compid ?? 0),
        branchid: Number(PurchaseOrder.branchid ?? 0),
        finid: Number(PurchaseOrder.finid ?? 0),
        vnumid: Number(PurchaseOrder.vnumid ?? 0),
        vendorid: Number(PurchaseOrder.vendorid ?? 0),
        vendornm: PurchaseOrder.vendornm,

        qty1: Number(PurchaseOrder.qty1 ?? 0),
        qty2: Number(PurchaseOrder.qty2 ?? 0),
        totprodval: Number(PurchaseOrder.totprodval ?? 0),
        afttax: Number(PurchaseOrder.afttax ?? 0),
        ordamt: Number(PurchaseOrder.ordamt ?? 0),

        itemdtl:
          PurchaseOrder.itemdtl?.map((item, index) => ({
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
            altunimethod: item.altunimethod ?? "A",
            altunitfactor: Number(item.altunitfactor ?? 1),
            alterunitfactortype: item.alterunitfactortype ?? "M",
            rateon: Number(item.rateon ?? 1),
          })) ?? [],
      });
    }
  }, [PurchaseOrder, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "PO";
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

  // Model Search Vendoe Modal Handlers
  const baseVendoeParams = {
    userid: userId,
    compid: companyId,
  };

  const searchVendoeColumns = [
    { key: "name", label: "Name" },
  ];

  const searchVendoeFields = [
    { value: "name", label: "Name" },
  ];

  const handleVendoeSelect = (row: any) => {
    setValue("vendorid", row.id);
    setValue("vendorName", row.name);
    setVendorFormOpen(false);
    requestAnimationFrame(() => {
      proFormaRef.current?.focus();

    });
  };

  const vendorName = watch("vendorName") || watch("vendornm");

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
        altunimethod: item?.altunimethod || "A",
        altunitfactor: item?.altunitfactor || 1,
        alterunitfactortype: item?.alterunitfactortype || "M",
        rateon: item?.rateon || 1,
      };
    });

    return { qty1, totprodval, itemdtl };
  };

  const approveOptions = [
    { value: "A", label: "Approve" },
    { value: "R", label: "Rejected" },
  ];

  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter(Boolean);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      if (isApproveMode) return "Approving...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    if (isApproveMode) return "Approve";
    return "Save";
  };

  const handleFormSubmit = async (data: PurchaseOrderFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Purchase Order",
          message: "Are you sure you want to delete this Purchase Order?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formPurchaseOrderId,
          userid: Number(userId),
          compid: Number(companyId),
        });
        onClose();
        return;
      }

      const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: PurchaseOrderFormType = {
        ...data,
        compid: companyId,
        branchid: toolbarBranchId,
        qty1: Number(qty1),
        qty2: Number(qty1),
        totprodval: totprodval,
        afttax: 0,
        ordamt: totprodval,
        itemdtl,

      };

      if (isAddMode) {
        const response = await createMutation.mutateAsync(payload);

        reset(pruchaseOrderFormDefaults);
        setTimeout(() => {
          setFocus("orderdt");
        }, 1000);

        const newId = Number(response?.id);
        if (newId > 0) {
          printPurchaseOrder({ id: newId });
        } else {
          toast.error("Invalid Purchase Order ID. Unable to print.");
        }
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formPurchaseOrderId,
          data: payload,
        });
        onClose();

        if (formPurchaseOrderId > 0) {
          printPurchaseOrder({ id: formPurchaseOrderId });
        } else {
          toast.error("Invalid Purchase Order ID. Unable to print.");
        }
      }

      const approvePayload: PurchaseOrderFormType = {
        ...data,
        id: formPurchaseOrderId,
        compid: companyId,
        branchid: toolbarBranchId,
        qty1: Number(qty1),
        qty2: Number(qty1),
        totprodval: totprodval,
        finid: Number(finid),
        afttax: 0,
        ordamt: totprodval,
        itemdtl,
      };

      if (isApproveMode) {

        await approveMutation.mutateAsync(approvePayload)
        reset(pruchaseOrderFormDefaults);
        onClose();
        return;
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  const handleAddItem = async () => {
    // Validate the last item row before adding a new one
    const lastIndex = fields.length - 1;

    if (fields.length > 0) {
      // Validate the last item's fields
      const isValid = await trigger([
        `itemdtl.${lastIndex}.productid`,
        `itemdtl.${lastIndex}.qty1`,
      ]);

      if (!isValid) {
        toast.error("Please complete the current item row first");
        return;
      }
    }

    // Append new item with default values
    append({
      productid: 0,
      qty1: 0,
      rate: 0,
      value: 0,
      qty2: 0,
      tag: "I",
      dtlid: fields.length + 1,
      altunimethod: "A",
      altunitfactor: 1,
      alterunitfactortype: "M",
      rateon: 1,
    });

    // Focus on the brand input of the new row
    const newIndex = fields.length;
    setTimeout(() => {
      brandInputRefs.current[newIndex]?.focus();
    }, 100);
  };


  const lookupMap = {
    vendor: () => setVendorFormOpen(true),
  };

  const bindLookup = useLookupShortcuts(isReadOnly, lookupMap);

  const handleKeyOpen = (e: React.KeyboardEvent, openFn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFn();
    }
  };


  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };


  return (
    <>
      <Popup
        visible={visible}
        onHiding={onClose}
        title={`${mode} Purchase Order`}
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
          <div className="flex-1 overflow-y-auto p-1 space-y-1">

            <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">

              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> Purchase Order Information </h2>

              <div className="flex flex-wrap gap-1 items-end">

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Series No.</label>
                  <FormSelect
                    name="vnumid"
                    control={control}
                    options={seriesNoOptions}
                  />
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Num. Method</label>
                  <FormSelect
                    name="vnummethod"
                    control={control}
                    options={numMethodOptions}
                    isDisabled={selectedSeries?.manualallow === "N"}
                  />
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Order Date</label>
                  <input
                    type="date"
                    {...register("orderdt")}
                    disabled={isReadOnly}
                    className={`inputField ${errors.orderdt ? "text-red-500" : "border-gray-400"}`}
                  />
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Order No</label>
                  <input
                    type="text"
                    {...register("orderno")}
                    disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                    className={`
                    inputField 
                    ${errors.orderno ? "" : "border-gray-400"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  />
                </div>

                <div className="w-110">
                  <label className="block text-gray-700 font-medium mb-1">Vendor <strong className="text-red-500"> * </strong> </label>
                  <input
                    type="text"
                    value={vendorName || ''}
                    disabled={isReadOnly}
                    readOnly
                    {...bindLookup(LOOKUP_KEYS.vendor)}
                    onKeyDown={(e) => handleKeyOpen(e, () => setVendorFormOpen(true))}
                    onClick={() => setVendorFormOpen(true)}
                    className={`inputField w-full border border-gray-300 
                    ${errors.vendorid && !vendorName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                    }
                    placeholder="Select Vendor"
                  />
                  {errors.vendorid && !vendorName && <p className="text-red-500 mt-1 text-sm">{errors.vendorid.message}</p>}
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Proforma invoice no.</label>
                  <input
                    type="text"
                    {...register("quotno")}
                    ref={(e) => {
                      register("quotno").ref(e);
                      proFormaRef.current = e;
                    }}
                    disabled={isReadOnly}
                    placeholder="Enter Proforma invoice no."
                    className={`inputField ${errors.quotno ? "" : "border-gray-400"}`}
                  />
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Proforma invoice date</label>
                  <input
                    type="date"
                    {...register("quotdt")}
                    disabled={isReadOnly}
                    className={`inputField ${errors.quotdt ? "" : "border-gray-400"}`}
                  />
                </div>

                <div className="w-48">
                  <label className="block text-gray-700 font-medium mb-1">Branch </label>
                  <input
                    type="text"
                    tabIndex={-1}
                    value={formSelectedBranch}
                    readOnly
                    className={`inputField border-gray-400 bg-gray-100 cursor-not-allowed `}
                  />
                </div>

              </div>
            </section>

            {/* Item Details */}
            <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">

              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                  Item Details
                </h2>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        productid: 0,
                        qty1: 0,
                        rate: 0,
                        value: 0,
                        qty2: 0,
                        tag: "I",
                        dtlid: fields.length + 1,
                        altunimethod: "A",
                        altunitfactor: 1,
                        alterunitfactortype: "M",
                        rateon: 1,
                      })
                    }
                    className="primary-btn text-xs px-3 py-1"
                  >
                    + Add Item
                  </button>
                )}
              </div>

              <div className="space-y-1">
                {fields.map((field, index) => (
                  <PurchaseOrderItems
                    key={field.id}
                    index={index}
                    field={field}
                    control={control}
                    setValue={setValue}
                    setFocus={setFocus}
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
                    excludeIds={selectedProductIds}
                    currentId={watchedItems?.[index]?.productid}
                    brandInputRef={(el) => {
                      brandInputRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-1 items-center border-t-2 mt-1">

                <div className="w-68" />

                <div className="w-120" />

                <div className="w-28 relative">
                  <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                    Total Qty
                  </span>
                  <input
                    type="number"
                    value={totalQty}
                    tabIndex={-1}
                    readOnly
                    className="inputField w-full bg-gray-100"
                  />
                </div>

                <div className="w-28" />

                <div className="w-28 relative">
                  <span className="absolute -left-24 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                    Total Value
                  </span>
                  <input
                    type="number"
                    value={Number(totalValue.toFixed(2))}
                    readOnly
                    tabIndex={-1}
                    className="inputField w-full bg-gray-100"
                  />
                </div>

                <div className="w-12" />

              </div>

            </section>

            {/* Remarks */}
            <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">
              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                Remarks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Remark 1 </label>
                  <input
                    {...register("rem1")}
                    placeholder="Write remarks... "
                    disabled={isReadOnly}
                    className={`inputField ${errors.rem1 ? "" : "border-gray-400"}`}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Remark 2 </label>
                  <input
                    {...register("rem2")}
                    placeholder="Write remarks... "
                    disabled={isReadOnly}
                    className={`inputField ${errors.rem2 ? "" : "border-gray-400"}`}
                  />
                </div>
              </div>
            </section>


            {isApproveMode && (
              <>
                <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">
                  <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                    Approvable
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div >
                      <label className="block text-gray-700 font-medium mb-1">Approve Status <strong className="text-red-500"> * </strong> </label>
                      <FormSelect
                        name="aprvstatus"
                        control={control}
                        options={approveOptions}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Approve Remark <strong className="text-red-500"> * </strong> </label>
                      <input
                        {...register("aprvremarks")}
                        placeholder="Approve remark "
                        disabled={isReadOnly}
                        className={`inputField ${errors.aprvremarks ? "border-red-500" : "border-gray-400"}`}
                      />
                      {errors.aprvremarks && <p className="text-red-500 mt-1 text-sm">{errors.aprvremarks.message}</p>}
                    </div>
                  </div>
                </section>
              </>
            )}

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
              onClick={handleExit}
              disabled={isSubmitting}
              className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Exit
            </button>
          </div>

          {(isSubmitting || isLoadingPurchaseOrder || isPrinting) && <Loader />}

          <SearchModal
            open={vendorFormOpen}
            onClose={() => setVendorFormOpen(false)}
            endpoint="vendor"
            baseParams={baseVendoeParams}
            columns={searchVendoeColumns}
            searchFields={searchVendoeFields}
            onSelect={handleVendoeSelect}
            createNewConfig={{
              enabled: true,
              label: "Create New Vendor",
              onCreateNew: handleSortcutCreate,
            }}
          />

        </form>
      </Popup>
    </>
  );


}