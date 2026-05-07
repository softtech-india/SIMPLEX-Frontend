'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useSaleOrderById, useCreateSaleOrder, useUpdateSaleOrder, useDeleteSaleOrder, useApproveSaleOrder } from "../hooks/useSaleOrder";
import { SaleOrderFormType, OperationMode } from "../types/saleOrder.types";
import { SaleOrderFormSchema } from "../schemas/saleOrder.schema";
import { pruchaseOrderFormDefaults } from "../constants/saleOrderFormDefaults";
import { useSaleOrderForm } from "../hooks/useSaleOrderForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { SaleOrderItems } from "./SaleOrderItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";

interface SaleOrderFormProps {
  visible: boolean;
  onClose: () => void;
  formSaleOrderId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function SaleOrderForm({ visible, onClose, formSaleOrderId, mode, formSelectedBranch, toolbarBranchId }: SaleOrderFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const confirmDelete = useConfirm();

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    },
    visible
  );

  const { data: SaleOrder, isLoading: isLoadingSaleOrder } =
    useSaleOrderById({
      id: formSaleOrderId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateSaleOrder();
  const updateMutation = useUpdateSaleOrder();
  const deleteMutation = useDeleteSaleOrder();
  const approveMutation = useApproveSaleOrder();

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
  } = useSaleOrderForm(isApproveMode);

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

    if (SaleOrder) {
      reset({
        ...pruchaseOrderFormDefaults,

        ...SaleOrder,

        aprvstatus: "",

        orderdt: SaleOrder.orderdt ? formatDateForInput(SaleOrder.orderdt) : "",
        partyordno: SaleOrder.partyordno ? formatDateForInput(SaleOrder.partyordno) : "",
        partyorddt: SaleOrder.partyorddt ? formatDateForInput(SaleOrder.partyorddt) : "",

        compid: Number(SaleOrder.compid ?? 0),
        branchid: Number(SaleOrder.branchid ?? 0),
        finid: Number(SaleOrder.finid ?? 0),
        vnumid: Number(SaleOrder.vnumid ?? 0),
        vendorid: Number(SaleOrder.vendorid ?? 0),
        vendornm: SaleOrder.vendornm,

        qty1: Number(SaleOrder.qty1 ?? 0),
        qty2: Number(SaleOrder.qty2 ?? 0),
        totprodval: Number(SaleOrder.totprodval ?? 0),
        afttax: Number(SaleOrder.afttax ?? 0),
        ordamt: Number(SaleOrder.ordamt ?? 0),

        itemdtl:
          SaleOrder.itemdtl?.map((item, index) => ({
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
  }, [SaleOrder, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "SO";
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

  // Model Search Customer Modal Handlers
  const baseCustomerParams = {
    userid: userId,
    compid: companyId,
  };

  const searchCustomerColumns = [
    { key: "name", label: "name." },
  ];

  const searchCustomerFields = [
    { value: "name", label: "Name" },
  ];

  const handleCustomerSelect = (row: any) => {
    setValue("customerid", row.id);
    setValue("customernm", row.name);
    setCustomerModalOpen(false);
  };

  const customerName = watch("customernm") 

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

  const handleFormSubmit = async (data: SaleOrderFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Sale Order",
          message: "Are you sure you want to delete this Sale Order?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formSaleOrderId,
          userid: Number(userId),
          compid: Number(companyId),
        });
        onClose();
        return;
      }

      const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: SaleOrderFormType = {
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
          id: formSaleOrderId,
          data: payload,
        });
        onClose();
      }

      const approvePayload: SaleOrderFormType = {
        ...data,
        id: formSaleOrderId,
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
      title={`${mode} Sale Order`}
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

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> Sale Order Information </h2>

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
              </div>

              <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1"> Customer <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={customerName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setCustomerModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.customerid && !customerName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select Customer"
                />
                {errors.customerid && !customerName && <p className="text-red-500 mt-1 text-sm">{errors.customerid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Proforma invoice no.</label>
                <input
                  type="text"
                  {...register("partyordno")}
                  disabled={isReadOnly}
                  placeholder="Enter Proforma invoice no."
                  className={`inputField ${errors.partyordno ? "" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Proforma invoice date</label>
                <input
                  type="date"
                  {...register("partyorddt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.partyorddt ? "" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Branch </label>
                <input
                  type="text"
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 bg-gray-100 cursor-not-allowed `}
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
                <SaleOrderItems
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
                  <div >
                    <label className="block text-gray-700 font-medium mb-1">Approve Status <strong className="text-red-500"> * </strong> </label>
                    <FormSelect
                      name="aprvstatus"
                      control={control}
                      options={approveOptions}
                    />
                    {/* {errors.aprvstatus && <p className="text-red-500 mt-1 text-sm">{errors.aprvstatus.message}</p>} */}
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
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit
          </button>
        </div>

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isSubmitting || isLoadingSaleOrder}
          showIndicator
        />

        <SearchModal
          open={customerModalOpen}
          onClose={() => setCustomerModalOpen(false)}
          endpoint="customer"
          baseParams={baseCustomerParams}
          columns={searchCustomerColumns}
          searchFields={searchCustomerFields}
          onSelect={handleCustomerSelect}
        />

      </form>
    </Popup>
  );


}