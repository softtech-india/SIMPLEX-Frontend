'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { useSaleOrderById, useCreateSaleOrder, useUpdateSaleOrder, useDeleteSaleOrder, useApproveSaleOrder, usePrintTbill } from "../hooks/useSaleOrder";
import { SaleOrderFormType, OperationMode } from "../types/saleOrder.types";
import { SaleOrderFormSchema } from "../schemas/saleOrder.schema";
import { defaultItemDtl, saleOrderFormDefaults } from "../constants/saleOrderFormDefaults";
import { useSaleOrderForm } from "../hooks/useSaleOrderForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { SaleOrderItems } from "./SaleOrderItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import { useSaleQrScanner } from "@/hooks/useSaleQrScanner";
import Loader from "@/common/components/Loader";
import { toast } from "sonner";

interface SaleOrderFormProps {
  visible: boolean;
  onClose: () => void;
  formSaleOrderId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
  onUpdated?: () => void;
}

export function SaleOrderForm({ visible, onClose, formSaleOrderId, mode, formSelectedBranch, toolbarBranchId, onUpdated }: SaleOrderFormProps) {

  // Hooks
  const { userId, companyId, branchId, finid, } = useUserStore();

  const confirmDelete = useConfirm();
  const { mutate: printTbill, isPending: isPrinting } = usePrintTbill();

  // State
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const godownRef = useRef<HTMLInputElement>(null);
  const brandInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Drive State
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
    control, register, handleSubmit, setFocus, reset, watch, setValue, getValues, trigger, formState: { errors },
  } = useSaleOrderForm(isApproveMode);

  const { fields, append, remove, replace } = useFieldArray({
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

  const { scanInputRef, handleScan } = useSaleQrScanner({
    setValue,
    onUpdateItems: (updater) => {
      const currentItems = getValues("itemdtl") || [];
      const updatedItems = updater(currentItems);

      replace(updatedItems);
      trigger("itemdtl");
    },
  });

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("orderdt");
    }, 1000);

    if (isAddMode) {
      reset(saleOrderFormDefaults);
      return;
    }

    if (SaleOrder) {
      reset({
        ...saleOrderFormDefaults,

        ...SaleOrder,

        aprvstatus: "",

        orderdt: SaleOrder.orderdt ? formatDateForInput(SaleOrder.orderdt) : "",
        partyorddt: SaleOrder.partyorddt ? formatDateForInput(SaleOrder.partyorddt) : "",

        partyordno: SaleOrder.partyordno ?? "",

        compid: Number(SaleOrder.compid ?? 0),
        branchid: Number(SaleOrder.branchid ?? 0),
        finid: Number(SaleOrder.finid ?? 0),
        vnumid: Number(SaleOrder.vnumid ?? 0),
        customerid: Number(SaleOrder.customerid ?? 0),
        godownid: Number(SaleOrder.godownid ?? 0),

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
            // rate: Number(item.rate ?? 0),
            rate: 0,
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
    requestAnimationFrame(() => {
      godownRef.current?.focus();
    });
  };

  const customerName = watch("customernm")

  // Model Search Godown Modal Handlers
  const baseGodownParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId
  };

  const searchGodownColumns = [
    { key: "name", label: "Name" },
  ];

  const searchGodownFields = [
    { value: "name", label: "Name" },
  ];

  const handleGodownSelect = (row: any) => {
    // console.log("godown row :", row)
    setValue("godownid", row.id);
    setValue("godownName", row.name);
    setGodownModalOpen(false);
    requestAnimationFrame(() => {
      setFocus("qrcode");
    });

  };

  const godownName = watch("godownName") || watch("godownnm");

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

  const orderDate = watch('orderdt') || '';
  const GodownId = watch('godownid') || 0;


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

  const handleAddItem = async () => {
    // Check if there are any fields before validating the last one
    if (fields.length > 0) {
      const lastIndex = fields.length - 1;
      const isValid = await trigger([
        `itemdtl.${lastIndex}.productid`,
      ]);

      if (!isValid) {
        return;
      }
    }

    append({
      ...defaultItemDtl,
      dtlid: fields.length + 1,
    });

    const newIndex = fields.length;
    setTimeout(() => {
      brandInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  const handleFormSubmit = async (data: SaleOrderFormSchema) => {

    if (isDeleteMode) {

      const ok = await confirmDelete({
        title: "Delete T-Bill? ",
        message: "Are you sure you want to delete this T-Bill? ?",
      });

      if (!ok) return;

      deleteMutation.mutate(
        {
          id: formSaleOrderId, userid: Number(userId), compid: Number(companyId),
        },
        {
          onSuccess: (data) => {
            if (!data?.success) return;
            onClose();
          },
        }
      );

      return;
    }

    const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

    const payload: SaleOrderFormType = {
      ...data,
      compid: companyId,
      branchid: toolbarBranchId,
      finid: Number(finid),
      qty1: Number(qty1),
      qty2: Number(qty1),
      totprodval: totprodval,
      afttax: 0,
      ordamt: totprodval,
      itemdtl,
    };

    if (isAddMode) {

      createMutation.mutate(payload, {
        onSuccess: (data) => {
          if (!data?.success) return;

          reset(saleOrderFormDefaults);
          replace([]);
          requestAnimationFrame(() => {
            replace([]);
          });
          // onClose();

          const saleOrderId = Number(data.id);

          if (saleOrderId > 0) {
            printTbill({
              id: saleOrderId,
              withrate: "Y",
            });
          } else {
            toast.error("Invalid Sale Order ID. Unable to print.");
          }
          // printTbill({
          //   id: data.id || 0,
          //   withrate: "Y",
          // })
        },
      });
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: formSaleOrderId, data: payload,
        },
        {
          onSuccess: (data) => {
            if (!data?.success) return;
            const saleOrderId = Number(formSaleOrderId);

            onUpdated?.();

            onClose();

            if (saleOrderId > 0) {
              printTbill({
                id: saleOrderId,
                withrate: "Y",
              });
            } else {
              toast.error("Invalid Sale Order ID. Unable to print.");
            }

          },
        }
      );
    }

    if (isApproveMode) {
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

      await approveMutation.mutateAsync(approvePayload);
      reset(saleOrderFormDefaults);
      replace([]);
      onClose();
      return;
    }

  };



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
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} T-Bill`}
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

          <section className="border rounded-md p-1 shadow-sm bg-white space-y-3">

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> T-Bill Information </h2>

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
                <label className="block text-gray-700 font-medium mb-1">T-Bill Date</label>
                <input
                  type="date"
                  {...register("orderdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.orderdt ? "text-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">T-Bill No</label>
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
                  onKeyDown={(e) => handleKeyOpen(e, () => setCustomerModalOpen(true))}

                  onClick={() => setCustomerModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.customerid && !customerName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select Customer"
                />
                {/* {errors.customerid && !customerName && <p className="text-red-500 mt-1 text-sm">{errors.customerid.message}</p>} */}
              </div>

              {/* <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Party order no.</label>
                <input
                  type="text"
                  {...register("partyordno")}
                  disabled={isReadOnly}
                  placeholder="Enter Party order no."
                  className={`inputField ${errors.partyordno ? "" : "border-gray-400"}`}
                />
              </div> */}

              {/* <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Party order date</label>
                <input
                  type="date"
                  {...register("partyorddt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.partyorddt ? "" : "border-gray-400"}`}
                />
              </div> */}

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Branch </label>
                <input
                  type="text"
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 bg-gray-100 cursor-not-allowed `}
                />
              </div>

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1"> Godown <span className="text-red-500">*</span> </label>
                <input
                  type="text"
                  value={godownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setGodownModalOpen(true))}
                  onClick={() => setGodownModalOpen(true)}
                  ref={(e) => {
                    godownRef.current = e;
                  }}
                  className={`inputField w-full border border-gray-300 
                    ${errors.godownid && !godownName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder="Select Godown"
                />
              </div>

              
              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1"> Scan QR Code <span className="text-red-500"> *</span> </label>

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
                  onClick={handleAddItem}
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
                  orderDate={orderDate}
                  GodownId={GodownId}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}
                  excludeIds={selectedProductIds}
                  handleKeyOpen={handleKeyOpen}
                  currentId={watchedItems?.[index]?.productid}
                  brandInputRef={(el) => {
                    brandInputRefs.current[index] = el;
                  }}
                  setFocus={setFocus}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-1 items-center border-t pt-3">

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

        {isSubmitting || isLoadingSaleOrder && <Loader />}

      </form>

      <SearchModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        endpoint="customer"
        baseParams={baseCustomerParams}
        columns={searchCustomerColumns}
        searchFields={searchCustomerFields}
        onSelect={handleCustomerSelect}
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