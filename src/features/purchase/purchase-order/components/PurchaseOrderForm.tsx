'use client';

import { useEffect, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { usePurchaseOrderById, useCreatePurchaseOrder, useUpdatePurchaseOrder, useDeletePurchaseOrder, useApprovePurchaseOrder } from "../hooks/usePurchaseOrder";
import { fetchVendorList } from "@/api/master/ledger-api";
import { PurchaseOrderFormType, OperationMode } from "../types/purchaseOrder.types";
import { PurchaseOrderFormSchema } from "../schemas/purchaseOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/pruchaseOrderFormDefaults";
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

  const [vendoeodalOpen, setVendoeodalOpen] = useState(false);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isApproveMode = mode === "Approve";
  const isReadOnly = mode === "View" || mode === "Print";

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
  }) || [];

  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty1) || 0);
  }, 0) || 0;

  const totalValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.qty1) || 0;
    const rate = Number(item?.rate) || 0;

    return sum + qty * rate;
  }, 0) || 0;

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("orderdt");
    }, 1000);

    if (isAddMode) {
      reset(pruchaseOrderFormDefaults);
      return;
    }

    if (PurchaseOrder) {
      reset({
        ...pruchaseOrderFormDefaults,

        ...PurchaseOrder,

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

  // Model Search Vendoe Modal Handlers
  const baseVendoeParams = {
    userid: userId,
    compid: companyId,
  };

  const searchVendoeColumns = [
    { key: "name", label: "name." },
  ];

  const searchVendoeFields = [
    { value: "name", label: "Name" },
  ];

  const handleVendoeSelect = (row: any) => {
    setValue("vendorid", row.id);
    setValue("vendorName", row.name);
    setVendoeodalOpen(false);
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
        branchid: toolbarBranchId,
        qty1: Number(qty1),
        qty2: Number(qty1),
        totprodval: totprodval,
        afttax: 0,
        ordamt: totprodval,
        itemdtl,

      };

      // console.log("FINAL SUBMIT PAYLOAD:", JSON.stringify(payload, null, 2));

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
        aprvstatus: data.aprvstatus,
        aprvremarks: data.aprvremarks?.trim() || "",
        itemdtl,
      };

      if (isApproveMode) {

        if (!data.aprvstatus) {
          toast.error("Please select approval status");
          return;
        }

        if (data.aprvstatus === "R" && !data.aprvremarks?.trim()) {
          toast.error("Please enter remark for rejection");
          return;
        }

        await approveMutation.mutateAsync(approvePayload)
        reset(pruchaseOrderFormDefaults);
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
      if (isApproveMode) return "Approving...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    if (isApproveMode) return "Approve";
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
      title={`${mode} Purchase Order`}
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
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Purchase Order Information
            </h2>

            <div className="flex flex-wrap gap-4 items-end">

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
                {/* {selectedSeries?.manualallow === "N" && (
                  <p className="text-xs text-gray-400 ">
                    Order number is system generated 
                  </p>
                )} */}
              </div>

              {/* <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1">Vendor</label>
                <FormSelect
                  name="vendorid"
                  control={control}
                  options={VendorspOptions}
                  className={`${errors?.vendorid ? "border-red-500" : "border-gray-400"}`}
                />
              </div> */}

              <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1">Vendor <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={vendorName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setVendoeodalOpen(true)}
                  className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                  placeholder="Select GRN Pending"
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Enquiry No</label>
                <input
                  type="text"
                  {...register("enqno")}
                  disabled={isReadOnly}
                  placeholder="Enter enquiry no."
                  className={`inputField ${errors.enqno ? "" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Enquiry Date</label>
                <input
                  type="date"
                  {...register("enqdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.enqdt ? "" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Quotation No</label>
                <input
                  type="text"
                  {...register("quotno")}
                  disabled={isReadOnly}
                  placeholder="Enter quotation no."
                  className={`inputField ${errors.quotno ? "" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Quotation Date</label>
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
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 `}
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
                  className={`inputField ${errors.delvplace ? "" : "border-gray-400"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Transport Mode </label>
                <input
                  type="text"
                  placeholder="Transport Mode"
                  {...register("transportmode")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.transportmode ? "" : "border-gray-400"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Delivery Days </label>
                <input
                  type="text"
                  placeholder="Delivery Days"
                  {...register("delvdays")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.delvdays ? "" : "border-gray-400"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Term </label>
                <input
                  type="text"
                  placeholder="Payment Terms"
                  {...register("paymentterms")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.paymentterms ? "" : "border-gray-400"}`}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Payment Mode </label>
                <input
                  type="text"
                  placeholder="Payment Mode"
                  {...register("paymentmode")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.paymentmode ? "" : "border-gray-400"}`}
                />
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

            <div className="space-y-2">
              {fields.map((field, index) => (
                <PurchaseOrderItems
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

              <div className="w-68" />

              <div className="w-120" />

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

              <div className="w-28" />

              <div className="w-28 relative">
                <span className="absolute -left-24 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total Value
                </span>
                <input
                  type="number"
                  value={totalValue}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>

              <div className="w-12" />

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
                  className={`inputField ${errors.rem1 ? "" : "border-gray-400"}`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Remark 2 </label>
                <input
                  {...register("rem2")}
                  placeholder="Remark 2"
                  disabled={isReadOnly}
                  className={`inputField ${errors.rem2 ? "" : "border-gray-400"}`}
                />
              </div>
            </div>
          </section>


          {isApproveMode && (
            <>
              <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
                <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                  Approvable
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="w-64">
                    <label className="block text-gray-700 font-medium mb-1">Remark 1 </label>
                    <FormSelect
                      name="aprvstatus"
                      control={control}
                      options={approveOptions}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-700 font-medium mb-1">Approve Remark </label>
                    <input
                      {...register("aprvremarks")}
                      placeholder="Approve remark "
                      disabled={isReadOnly}
                      className={`inputField ${errors.rem2 ? "" : "border-gray-400"}`}
                    />
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
          visible={isSubmitting || isLoadingPurchaseOrder}
          showIndicator
        />

        <SearchModal
          open={vendoeodalOpen}
          onClose={() => setVendoeodalOpen(false)}
          endpoint="vendor"
          baseParams={baseVendoeParams}
          columns={searchVendoeColumns}
          searchFields={searchVendoeFields}
          onSelect={handleVendoeSelect}
        />

      </form>
    </Popup>
  );


}