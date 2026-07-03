'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { useDeliveryChallanById, useCreateDeliveryChallan, useUpdateDeliveryChallan, useDeleteDeliveryChallan, useSoPackedProductList, usePrintDeliveryChallan, } from "../hooks/useDeliveryChallan";
import { DeliveryChallanFormType, OperationMode, DeliveryChallanItem } from "../types/deliveryChallan.types";
import { DeliveryChallanFormSchema } from "../schemas/deliveryChallan.schema";
import { DeliveryChallanFormDefaults } from "../constants/deliveryChallanFormDefaults";
import { useDeliveryChallanForm } from "../hooks/useDeliveryChallanForm";

import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { DeliveryChallanItems } from "./DeliveryChallanItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import MultipleSearchModal from "@/common/components/MultipleSearchModal";
import SearchModal from "@/common/components/SearchModal";
import Loader from "@/common/components/Loader";
import { toast } from "sonner";

interface DeliveryChallanFormProps {
  visible: boolean;
  onClose: () => void;
  formDeliveryChallanId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
  onUpdated?: () => void;
}

export function DeliveryChallanForm({ visible, onClose, formDeliveryChallanId, mode, formSelectedBranch, toolbarBranchId }: DeliveryChallanFormProps) {

  // Hooks
  const {
    userId, companyId, branchId, finid,
  } = useUserStore();

  const confirmDelete = useConfirm();
  const { mutate: printDeliveryChallan, isPending: isPrinting } = usePrintDeliveryChallan();

  const formRef = useRef<HTMLFormElement>(null);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [picklistModalOpen, setPicklistModalOpen] = useState(false);

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

  const { data: DeliveryChallan, isLoading: isLoadingDeliveryChallan } =
    useDeliveryChallanById({
      id: formDeliveryChallanId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateDeliveryChallan();
  const updateMutation = useUpdateDeliveryChallan();
  const deleteMutation = useDeleteDeliveryChallan();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control, register, handleSubmit, setFocus, reset, watch, setValue, getValues, trigger, formState: { errors },
  } = useDeliveryChallanForm(isApproveMode);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setFocus("dcdt");
    }, 300);

    if (isAddMode) {
      reset(DeliveryChallanFormDefaults);
      return () => clearTimeout(timer);
    }

    if (DeliveryChallan) {


      reset({
        ...DeliveryChallanFormDefaults,

        compid: Number(DeliveryChallan.compid ?? 0),
        branchid: Number(DeliveryChallan.branchid ?? 0),
        finid: Number(DeliveryChallan.finid ?? 0),
        vnumid: Number(DeliveryChallan.vnumid ?? 0),

        dcdt: DeliveryChallan.dcdt ? formatDateForInput(DeliveryChallan.dcdt) : "",
        dcno: DeliveryChallan.dcno ?? "",

        customerid: DeliveryChallan.customerid ?? 0,
        customernm: DeliveryChallan.customernm ?? "",

        godownid: DeliveryChallan.godownid ?? 0,
        godownnm: DeliveryChallan.godownnm ?? "",

        orderid: DeliveryChallan.orderid ?? 0,
        picklistid: DeliveryChallan.picklistid ?? 0,
        picklistno: DeliveryChallan.picklistno ?? "",

        qty: Number(DeliveryChallan.qty ?? 0),

        itemdtl:
          DeliveryChallan.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "U",
            dtlid: item.dtlid ?? index + 1,
            pcategorynm: item.pcategorynm ?? "",
            productid: Number(item.productid ?? 0),
            productnm: item.productnm ?? "",
            qty: Number(item.qty ?? 0),
            rate: Number(item.rate ?? 0),
            value: Number(item.qty ?? 0),
            unit: item.unit ?? "",
          })) ?? [],
      });


    }

    return () => clearTimeout(timer);
  }, [DeliveryChallan, isAddMode, visible, reset, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "DC";
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
    setValue("godownnm", row.name);
  };
  const GodownName = watch("godownnm")

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

  // Model Search Picklist Modal Handlers
  const basePicklistParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId,
    finid: Number(finid),
    customerid: watch("customerid") || 0,
  };

  const searchPicklistColumns = [
    { key: "orderno", label: "Order No" },
    { key: "picklistno", label: "Picklist No" },
  ];

  const searchPicklistFields = [
    { value: "picklistno", label: "Name" },
  ];

  const handlePicklistSelect = (row: any) => {
    console.log('Picklist Row :', row)
    setValue("orderid", row.id);
    setValue("picklistid", row.picklistid);
    setValue("picklistno", row.picklistno);
    setPicklistModalOpen(false);
  };

  const PicklistName = watch("picklistno")

  // Query
  const { data: SoPackedProductData } = useSoPackedProductList({
    userId: Number(userId),
    compid: Number(companyId),
    orderid: watch("orderid") || 0,
  });

  useEffect(() => {
    if (isEditMode || isDeleteMode) return;

    if (!SoPackedProductData) return;

    const formattedItems: DeliveryChallanItem[] = SoPackedProductData.map((item, index) => ({
      tag: 'I',
      dtlid: item.dtlid ?? index + 1,
      pcategorynm: item.pcategorynm ?? "",
      productid: item.productid ?? "",
      productnm: item.productnm ?? "",
      qty: item.qty1 ?? 0,
      rate: item.rate ?? 0,
      value: item.value ?? 0,
      unit: item.unit ?? "",
    }));

    setValue("itemdtl", formattedItems, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [SoPackedProductData, isEditMode, isDeleteMode, setValue]);

  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  });

  // Utility Funtyion
  const calculateTotals = (items: any[] = []) => {
    let totalqty = 0;
    let totprodval = 0;

    const itemdtl = items.map((item, index) => {
      const qty = Number(item?.qty) || 0;
      const rate = Number(item?.rate) || 0;
      const value = qty * rate;

      totalqty += qty;
      totprodval += value;

      return {
        tag: item?.tag || "I",
        dtlid: index + 1,
        orderdtlid: item?.dtlid,
        pcategorynm: item?.pcategorynm || "",
        productid: Number(item.productid ?? 0),
        qty: Number(qty),
        rate: Number(rate),
        value: Number(value),
        unit: item?.unit || "PCS",
      };
    });

    return { totalqty, totprodval, itemdtl };
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


  const handleFormSubmit = async (data: DeliveryChallanFormSchema) => {

    if (isDeleteMode) {

      const ok = await confirmDelete({
        title: "Delete Delivery Challan ",
        message: "Are you sure you want to delete this Delivery Challan ?",
      });

      if (!ok) return;

      deleteMutation.mutate(
        {
          id: formDeliveryChallanId, userid: Number(userId), compid: Number(companyId),
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

    const { totalqty, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

    const payload: DeliveryChallanFormType = {
      ...data,
      compid: Number(companyId),
      branchid: toolbarBranchId,
      qty: Number(totalqty),
      amt: Number(totprodval),
      itemdtl,
    };

    if (isAddMode) {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          if (!data?.success) return;
          reset(DeliveryChallanFormDefaults);

          const dcId = Number(data.id);

          if (dcId > 0) {
            printDeliveryChallan(dcId);
          } else {
            toast.error("Invalid requisition ID. Unable to print.");
          }
        },
      });
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: formDeliveryChallanId, data: payload,
        },
        {
          onSuccess: (data) => {
            if (!data?.success) return;
            onClose()
            const dcId = Number(data.id);

            if (dcId > 0) {
              printDeliveryChallan(dcId);
            } else {
              toast.error("Invalid requisition ID. Unable to print.");
            }
          },
        }
      );
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
      title={`${mode} Delivery Challan`}
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

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> Delivery Challan Information </h2>

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
                <label className="block text-gray-700 font-medium mb-1">DC Date</label>
                <input
                  type="date"
                  {...register("dcdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.dcdt ? "text-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">DC No</label>
                <input
                  type="text"
                  {...register("dcno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`
                    inputField 
                    ${errors.dcno ? "" : "border-gray-400"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Transporter Name</label>
                <input
                  type="text"
                  {...register("transportername")}
                  disabled={isReadOnly}
                  className={` inputField  ${errors.transportername ? "" : "border-gray-400"}  `}
                  placeholder="Enter transporter"
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Vehicle No</label>
                <input
                  type="text"
                  {...register("vehicleno")}
                  disabled={isReadOnly}
                  className={` inputField  ${errors.vehicleno ? "" : "border-gray-400"}  `}
                  placeholder="Enter Vehicle no."
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Narration</label>
                <input
                  type="text"
                  {...register("narration")}
                  disabled={isReadOnly}
                  className={` inputField  ${errors.narration ? "" : "border-gray-400"}  `}
                  placeholder="Enter Narration."
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

              <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1"> Customer <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={customerName}
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
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1"> Godown <strong className="text-red-500 text-sm"> * </strong></label>
                <input
                  type="text"
                  value={GodownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setGodownModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.godownid && !GodownName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select godown"
                />
              </div>

              <div className="w-110">
                <label className="block text-gray-700 font-medium mb-1"> Picklist <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={PicklistName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setPicklistModalOpen(true))}

                  onClick={() => setPicklistModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.picklistid && !PicklistName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select Picklist"
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

            </div>

            <div className="space-y-1">
              <DeliveryChallanItems
                items={watchedItems}
                errors={errors}
                register={register}
              />

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

        {isSubmitting || isLoadingDeliveryChallan && <Loader />}

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

      <SearchModal
        open={picklistModalOpen}
        onClose={() => setPicklistModalOpen(false)}
        endpoint="so/pendingpickedlist"
        baseParams={basePicklistParams}
        columns={searchPicklistColumns}
        searchFields={searchPicklistFields}
        onSelect={handlePicklistSelect}
      />

    </Popup>
  );


}