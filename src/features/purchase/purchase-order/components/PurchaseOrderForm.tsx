'use client';

import React, { useEffect, useMemo, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { usePurchaseOrderById, useCreatePurchaseOrder, useUpdatePurchaseOrder, useDeletePurchaseOrder } from "../hooks/usePurchaseOrder";
import { fetchVendorList } from "@/api/master/ledger-api";
import { PurchaseOrderFormType, OperationMode } from "../types/purchaseOrder.types";
import { PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";
import { usePurchaseOrderForm } from "../hooks/usePurchaseOrderForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { fetchCategoryList } from "@/api/master/product-api";
import { PurchaseOrderItems } from "./PurchaseOrderItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/lib/dateUtils";


interface PurchaseOrderFormProps {
  visible: boolean;
  onClose: () => void;
  formPurchaseOrderId: number;
  mode: OperationMode;
}

export function PurchaseOrderForm({ visible, onClose, formPurchaseOrderId, mode }: PurchaseOrderFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: PurchaseOrder, isLoading: isLoadingPurchaseOrder } =
    usePurchaseOrderById({
      id: formPurchaseOrderId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: branchId,
      finid: Number(finid),
    });

  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();
  const deleteMutation = useDeletePurchaseOrder();

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
  } = usePurchaseOrderForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itemdtl",
  });

  // Calculate Total Quantity and Vlaue
  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  });

  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty1) || 0);
  }, 0);

  const totalValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.qty1) || 0;
    const rate = Number(item?.rate) || 0;

    return sum + qty * rate;
  }, 0);

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("vnumid");
    }, 1000);

    if (isAddMode) {
      reset(pruchaseOrderFormDefaults);
      return;
    }

    if (PurchaseOrder) {
      reset({
        ...pruchaseOrderFormDefaults,

        ...PurchaseOrder,

        orderdt: formatDateForInput(PurchaseOrder.orderdt),
        enqdt: formatDateForInput(PurchaseOrder.enqdt),
        quotdt: formatDateForInput(PurchaseOrder.quotdt),


        compid: Number(PurchaseOrder.compid ?? 0),
        branchid: Number(PurchaseOrder.branchid ?? 0),
        finid: Number(PurchaseOrder.finid ?? 0),
        vnumid: Number(PurchaseOrder.vnumid ?? 0),
        vendorid: Number(PurchaseOrder.vendorid ?? 0),

        qty1: Number(PurchaseOrder.qty1 ?? 0),
        qty2: Number(PurchaseOrder.qty2 ?? 0),
        totprodval: Number(PurchaseOrder.totprodval ?? 0),
        afttax: Number(PurchaseOrder.afttax ?? 0),
        ordamt: Number(PurchaseOrder.ordamt ?? 0),

        itemdtl:
          PurchaseOrder.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            productid: item.productid,
            qty1: Number(item.qty1 ?? 0),
            qty2: Number(item.qty2 ?? 0),
            rate: Number(item.rate ?? 0),
            value: Number(item.value ?? 0),
            altunimethod: item.altunimethod ?? "A",
            altunitfactor: Number(item.altunitfactor ?? 1),
            alterunitfactortype:
              item.alterunitfactortype ?? "M",
            rateon: Number(item.rateon ?? 1),
          })) ?? [],
      });
    }
  }, [PurchaseOrder, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // seriesNoOptions
  const voucherType = "PO";

  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: ["fetchSeriesList", userId, companyId, branchId, voucherType],
    queryFn: () =>
      fetchSeriesList(userId, companyId, branchId, voucherType, finid),
    staleTime: 0,
    enabled: !!companyId && !!branchId && !!userId && !!visible,
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


  // Vendor
  const { data: VendorspOptions = [] } = useQuery({
    queryKey: ["VendorspOptions", userId, companyId],
    queryFn: () => fetchVendorList(userId, companyId),
    staleTime: 0,
    enabled: !!userId && !!companyId && !!visible,
    retry: 1,
    refetchOnWindowFocus: false,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

  // fetchCategoryList
  const { data: CategoryOptions = [] } = useQuery({
    queryKey: ["CategoryOptions", userId, companyId],
    queryFn: () => fetchCategoryList(userId, companyId),
    enabled: !!userId && !!companyId && !!visible,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

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

  // Submit handler
  const handleFormSubmit = async (data: PurchaseOrderFormSchema) => {
    try {
      if (isDeleteMode) {
        if (!window.confirm("Delete this PurchaseOrder?")) return;
        await deleteMutation.mutateAsync(formPurchaseOrderId);
        onClose();
        return;
      }

      const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: PurchaseOrderFormType = {
        ...data,
        compid: companyId,
        branchid: branchId,
        qty1: Number(qty1),
        qty2: Number(qty1),
        totprodval: totprodval,
        afttax: 0,
        ordamt: totprodval,
        itemdtl,

      };

      console.log("FINAL SUBMIT PAYLOAD:", JSON.stringify(payload, null, 2));

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(pruchaseOrderFormDefaults);
        onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formPurchaseOrderId,
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
      title={`${mode} PurchaseOrder`}
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

          {/* Purchase Order Info */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Purchase Order Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Series No.</label>
                <FormSelect
                  name="vnumid"
                  control={control}
                  options={seriesNoOptions}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Num. Method</label>
                <FormSelect
                  name="vnummethod"
                  control={control}
                  options={numMethodOptions}
                  isDisabled={selectedSeries?.manualallow === "N"}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Order Date</label>
                <input
                  type="date"
                  {...register("orderdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.orderdt ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Order No</label>
                <input
                  type="text"
                  {...register("orderno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`
                    w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition 
                    ${errors.orderno ? "" : "border-gray-300"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
                {selectedSeries?.manualallow === "N" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Order number is system generated for this series
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Vendor</label>
                <FormSelect
                  name="vendorid"
                  control={control}
                  options={VendorspOptions}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Enquiry No</label>
                <input
                  type="text"
                  {...register("enqno")}
                  disabled={isReadOnly}
                  placeholder="Enter enquiry no."
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.enqno ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Enquiry Date</label>
                <input
                  type="date"
                  {...register("enqdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.enqdt ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quotation No</label>
                <input
                  type="text"
                  {...register("quotno")}
                  disabled={isReadOnly}
                  placeholder="Enter quotation no."
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.quotno ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quotation Date</label>
                <input
                  type="date"
                  {...register("quotdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.quotdt ? "" : "border-gray-300"}`}
                />
              </div>

            </div>
          </section>

          {/* Delivery & Payment */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Delivery & Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Place</label>
                <input
                  type="text"
                  placeholder="Delivery Place"
                  {...register("delvplace")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.delvplace ? "" : "border-gray-300"}`}
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-1">Transport Mode </label>
                <input
                  type="text"
                  placeholder="Transport Mode"
                  {...register("transportmode")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.transportmode ? "" : "border-gray-300"}`}
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Days </label>
                <input
                  type="text"
                  placeholder="Delivery Days"
                  {...register("delvdays")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.delvdays ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Term </label>
                <input
                  type="text"
                  placeholder="Payment Terms"
                  {...register("paymentterms")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.paymentterms ? "" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Mode </label>
                <input
                  type="text"
                  placeholder="Payment Mode"
                  {...register("paymentmode")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.paymentmode ? "" : "border-gray-300"}`}
                />
              </div>

            </div>
          </section>


          {/* Item Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                Item Details
              </h2>

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() =>
                    append({
                      productid: undefined,
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

            <div className="space-y-2">
              {fields.map((field, index) => (
                <PurchaseOrderItems
                  key={field.id}
                  index={index}
                  field={field}
                  control={control}
                  CategoryOptions={CategoryOptions}
                  register={register}
                  remove={remove}
                  watchedItems={watchedItems}
                  userId={userId}
                  companyId={companyId}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {/* Total Quantity */}
              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">
                  Total Quantity
                </label>

                <input
                  type="number"
                  value={totalQty}
                  readOnly
                  className="w-full border rounded-md p-2.5 bg-gray-100"
                />
              </div>

              {/* Total Value */}
              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">
                  Total Product Value
                </label>

                <input
                  type="number"
                  value={totalValue}
                  readOnly
                  className="w-full border rounded-md p-2.5 bg-gray-100"
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
                <label className="block text-gray-700 font-medium mb-1">Remark 1 </label>
                <input
                  {...register("rem1")}
                  placeholder="Remark 1"
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.rem1 ? "" : "border-gray-300"}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Remark 2 </label>
                <input
                  {...register("rem2")}
                  placeholder="Remark 2"
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.rem2 ? "" : "border-gray-300"}`}
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
              {isSubmitting
                ? isDeleteMode ? "Deleting..." : "Saving..."
                : isDeleteMode ? "Delete" : "Save"}
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
          visible={isSubmitting || isLoadingPurchaseOrder}
          showIndicator
        />
      </form>
    </Popup>
  );


}