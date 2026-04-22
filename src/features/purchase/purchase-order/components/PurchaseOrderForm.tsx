'use client';

import React, { useEffect, useMemo, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { usePurchaseOrderById, useCreatePurchaseOrder, useUpdatePurchaseOrder, useDeletePurchaseOrder } from "../hooks/usePurchaseOrder";
import { fetchLedgerGroupList, fetchVendorList } from "@/api/master/ledger-api";
import { companyStatus } from "@/common/utility/data";
import { PurchaseOrderFormType, OperationMode } from "../types/purchaseOrder.types";
import { PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";
import { usePurchaseOrderForm } from "../hooks/usePurchaseOrderForm";
import { useAppStorage } from "@/hooks/useAuthStorage";
import { useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { fetchProductList } from "@/api/master/product-api";


interface PurchaseOrderFormProps {
  visible: boolean;
  onClose: () => void;
  formPurchaseOrderId: number;
  mode: OperationMode;
}

export function PurchaseOrderForm({ visible, onClose, formPurchaseOrderId, mode }: PurchaseOrderFormProps) {

  const {
    companyId,
    userId,
    branchId,
  } = useUserStore();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: PurchaseOrder, isLoading: isLoadingPurchaseOrder } = usePurchaseOrderById(formPurchaseOrderId);
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

  // for dynamic item value calculation
  const watchedItems = watch("itemdtl");

  useEffect(() => {
    watchedItems?.forEach((item, index) => {
      const qty = Number(item?.qty1) || 0;
      const rate = Number(item?.rate) || 0;

      setValue(`itemdtl.${index}.value`, qty * rate);
    });
  }, [watchedItems]);

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
        ...PurchaseOrder,
      });
    }
  }, [PurchaseOrder, isAddMode, reset, visible, setFocus]);


  // Fetch dropdown options
  // const { data: PurchaseOrdergroupOptions = [] } = useQuery({
  //   queryKey: ["PurchaseOrderGroupList", userId, companyId],
  //   queryFn: () => fetchLedgerGroupList(userId, companyId),
  //   staleTime: 0,
  //   enabled: !!companyId,
  //   retry: 1,
  //   refetchOnWindowFocus: false,

  //   select: (data) =>
  //     (data ?? []).map((s: any) => ({
  //       value: s.id,
  //       label: s.ledgergroup,
  //     })),
  // });

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // seriesNoOptions
  const voucherType = "PO";
  const finid = 1;

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

  // fetchProductList
  const { data: ProductOptions = [] } = useQuery({
    queryKey: ["ProductOptions", userId, companyId],
    queryFn: () => fetchProductList(userId, companyId),
    staleTime: 0,
    enabled: !!userId && !!companyId && !!visible,
    retry: 1,
    refetchOnWindowFocus: false,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.productname,
      })),
  });


  // useEffect(() => {
  //   console.log({ userId, companyId, branchId });
  //   console.log("ProductOptions data:", ProductOptions);
  // }, [ProductOptions, visible]);

  ;

  // Submit handler
  const handleFormSubmit = async (data: PurchaseOrderFormSchema) => {
    try {
      if (isDeleteMode) {
        if (!window.confirm("Delete this PurchaseOrder?")) return;
        await deleteMutation.mutateAsync(formPurchaseOrderId);
        onClose();
        return;
      }

      // const payload: PurchaseOrderFormType = {
      //   ...pruchaseOrderFormDefaults,
      //   ...data,
      // };

      // if (isAddMode) {
      //   await createMutation.mutateAsync(payload);
      //   reset(pruchaseOrderFormDefaults);
      //   onClose();
      //   return;
      // }

      // if (isEditMode) {
      //   await updateMutation.mutateAsync({
      //     id: formPurchaseOrderId,
      //     data: payload,
      //   });
      //   onClose();
      // }

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
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.orderdt ? "border-red-500" : "border-gray-300"}`}
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
                    ${errors.orderno ? "border-red-500" : "border-gray-300"} 
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
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.enqno ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Enquiry Date</label>
                <input
                  type="date"
                  {...register("enqdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.enqdt ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quotation No</label>
                <input
                  type="text"
                  {...register("quotno")}
                  disabled={isReadOnly}
                  placeholder="Enter quotation no."
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.quotno ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quotation Date</label>
                <input
                  type="date"
                  {...register("quotdt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.quotdt ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

            </div>
          </section>

          {/* Delivery & Payment */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Delivery & Payment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Place</label>
                <input
                  type="text"
                  placeholder="Delivery Place"
                  {...register("delvplace")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.delvplace ? "border-red-500" : "border-gray-300"}`}
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-1">Transport Mode </label>
                <input
                  type="text"
                  placeholder="Transport Mode"
                  {...register("transportmode")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.transportmode ? "border-red-500" : "border-gray-300"}`}
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Days </label>
                <input
                  type="text"
                  placeholder="Delivery Days"
                  {...register("delvdays")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.delvdays ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Term </label>
                <input
                  type="text"
                  placeholder="Payment Terms"
                  {...register("paymentterms")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.paymentterms ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Mode </label>
                <input
                  type="text"
                  placeholder="Payment Mode"
                  {...register("paymentmode")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.paymentmode ? "border-red-500" : "border-gray-300"}`}
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
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                >
                  {/* Product */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1"> Product </label>
                    <FormSelect
                      name={`itemdtl.${index}.productid`}
                      control={control}
                      options={ProductOptions}
                    />
                  </div>

                  {/* Qty */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1"> Quantity </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      {...register(`itemdtl.${index}.qty1`)}
                      disabled={isReadOnly}
                      className={`inputField ${errors.itemdtl?.[index]?.qty1 ? "border-red-500" : ""}`}
                    />
                  </div>

                  {/* Rate */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1"> Rate </label>
                    <input
                      type="number"
                      placeholder="Rate"
                      {...register(`itemdtl.${index}.rate`)}
                      disabled={isReadOnly}
                      className={`inputField ${errors.itemdtl?.[index]?.rate ? "border-red-500" : ""}`}
                    />
                  </div>

                  {/* Value (Auto-calculated) */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1"> Value </label>
                    <input
                      type="number"
                      placeholder="Value"
                      {...register(`itemdtl.${index}.value`)}
                      readOnly
                      className="inputField bg-gray-100"
                    />
                  </div>

                  {/* Remove */}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs w-20 flex items-center justify-center gap-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Amount Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Amount Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Total Product Value </label>
                <input
                  type="number"
                  placeholder="Total Product Value"
                  {...register("totprodval")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.totprodval ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">After Tax </label>
                <input
                  type="number"
                  placeholder="After Tax"
                  {...register("afttax")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.afttax ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Order Amount </label>
                <input
                  type="number"
                  placeholder="Order Amount"
                  {...register("ordamt")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ordamt ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quantity 1 </label>
                <input
                  type="number"
                  placeholder="Qty1"
                  {...register("qty1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.qty1 ? "border-red-500" : "border-gray-300"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Quantity 2 </label>
                <input
                  type="number"
                  placeholder="Qty2"
                  {...register("qty2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.qty2 ? "border-red-500" : "border-gray-300"}`}
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
                <label className="block text-gray-700 font-medium mb-1">Remark 2 </label>
                <input
                  {...register("rem1")}
                  placeholder="Remark 1"
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.rem1 ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Remark 2 </label>
                <input
                  {...register("rem2")}
                  placeholder="Remark 2"
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.rem2 ? "border-red-500" : "border-gray-300"}`}
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