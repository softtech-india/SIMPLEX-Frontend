'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { usePickListById, useCreatePickList, useUpdatePickList, useDeletePickList, useSoProductList, } from "../hooks/usePickList";
import { PickListFormType, OperationMode, PickListItem, PickListOrderDetail } from "../types/pickList.types";
import { PickListFormSchema } from "../schemas/pickList.schema";
import { PickListFormDefaults } from "../constants/pickListFormDefaults";
import { usePickListForm } from "../hooks/usePickListForm";

import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { PickListItems } from "./PickListItems";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import MultipleSearchModal from "@/common/components/MultipleSearchModal";
import SearchModal from "@/common/components/SearchModal";
import Loader from "@/common/components/Loader";

interface PickListFormProps {
  visible: boolean;
  onClose: () => void;
  formPickListId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
  onUpdated?: () => void;
}

export function PickListForm({ visible, onClose, formPickListId, mode, formSelectedBranch, toolbarBranchId }: PickListFormProps) {

  const {
    userId, companyId, branchId, finid,
  } = useUserStore();

  const confirmDelete = useConfirm();

  const formRef = useRef<HTMLFormElement>(null);
  const brandInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [tbillModalOpen, setTbillModalOpen] = useState(false);
  const [selectedTbills, setSelectedTbills] = useState<any[]>([]);
  const [godownModalOpen, setGodownModalOpen] = useState(false);

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

  const { data: PickList, isLoading: isLoadingPickList } =
    usePickListById({
      id: formPickListId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreatePickList();
  const updateMutation = useUpdatePickList();
  const deleteMutation = useDeletePickList();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control, register, handleSubmit, setFocus, reset, watch, setValue, getValues, trigger, formState: { errors },
  } = usePickListForm(isApproveMode);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setFocus("picklistdt");
    }, 300);

    if (isAddMode) {
      reset(PickListFormDefaults);
      setSelectedTbills([]);
      return () => clearTimeout(timer);
    }

    if (PickList) {
      const orderdtl =
        PickList.orderdtl?.map((item, index) => ({
          tag: item.tag ?? "U",
          dtlid: item.dtlid ?? index + 1,
          orderid: Number(item.orderid ?? 0),
          orderno: item.orderno ?? "",
        })) ?? [];

      // ✅ derive tbillid from orderdtl (IMPORTANT)
      const tbillid = orderdtl.map((o) => o.orderid);

      reset({
        ...PickListFormDefaults,

        picklistdt: PickList.picklistdt
          ? formatDateForInput(PickList.picklistdt)
          : "",

        picklistno: PickList.picklistno ?? "",

        godownid: PickList.godownid ?? 0,
        godownnm: PickList.godownnm ?? "",

        tbillid,
        tbillname: PickList.tbillname ?? "",

        compid: Number(PickList.compid ?? 0),
        branchid: Number(PickList.branchid ?? 0),
        finid: Number(PickList.finid ?? 0),
        vnumid: Number(PickList.vnumid ?? 0),

        qty: Number(PickList.qty ?? 0),

        orderdtl,

        itemdtl:
          PickList.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "U",
            dtlid: item.dtlid ?? index + 1,
            pcategorynm: item.pcategorynm ?? "—",
            productid: Number(item.productid ?? 0),
            productnm: item.productnm ?? "",
            qty: Number(item.qty ?? 0),
            unit: item.unit ?? "",
          })) ?? [],
      });

      // optional: sync UI chips
      setSelectedTbills(
        orderdtl.map((o) => ({
          id: o.orderid,
          orderno: o.orderno ?? "",
        }))
      );
    }

    return () => clearTimeout(timer);
  }, [PickList, isAddMode, visible, reset, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "PL";
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

  // Model Search Tbill Modal Handlers
  const today = new Date();
  const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  const baseTbillParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId,
    finid: Number(finid),
    startdt: `${year}-04-01`,
    enddt: `${year + 1}-03-31`
  };

  const searchTbillColumns = [
    { key: "orderno", label: "Name" },
  ];

  const searchTbillFields = [
    { value: "orderno", label: "Name" },
  ];

  const handleTbillSelect = (rows: any[]) => {
    setSelectedTbills(rows);

    setValue("tbillid", rows.map((x) => x.id));
    setValue("tbillname", rows.map((x) => x.orderno).join(", "));
  };

  const tbillid = watch('tbillid') || [];
  const tbillname = watch("tbillname") || [];
  const strorder = Array.isArray(tbillid) ? tbillid.join(",") : "";

  // Query
  const { data: SoProductData } = useSoProductList({
    userId: Number(userId),
    compid: Number(companyId),
    strorder: strorder,
  });

  useEffect(() => {
    if (isEditMode || isDeleteMode) return;

    if (!SoProductData) return;

    const formattedItems: PickListItem[] = SoProductData.map((item, index) => ({
      tag: 'I',
      dtlid: item.dtlid ?? index + 1,
      pcategorynm: item.pcategorynm ?? "",
      productid: item.productid ?? "",
      productnm: item.productnm ?? "",
      qty: item.qty1 ?? 0,
      unit: item.unit ?? "",
    }));

    setValue("itemdtl", formattedItems, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [SoProductData, isEditMode, isDeleteMode, setValue]);

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
        dtlid: item?.dtlid || index + 1,
        productid: Number(item.productid ?? 0),
        qty: Number(qty),
        rate: Number(rate),
        value: value,
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


  const handleFormSubmit = async (data: PickListFormSchema) => {

    if (isDeleteMode) {

      const ok = await confirmDelete({
        title: "Delete pick list ",
        message: "Are you sure you want to delete this pick list ?",
      });

      if (!ok) return;

      deleteMutation.mutate(
        {
          id: formPickListId, userid: Number(userId), compid: Number(companyId),
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

    const orderdtl: PickListOrderDetail[] = (data.tbillid || []).map(
      (orderId, index) => ({
        tag: "I",
        dtlid: index + 1,
        orderid: orderId,
      })
    );

    const payload: PickListFormType = {
      ...data,
      compid: Number(companyId),
      branchid: toolbarBranchId,
      qty: Number(totalqty),
      orderdtl,
      itemdtl,
    };


    if (isAddMode) {
      console.log("FINAL SUBMIT PAYLOAD:", JSON.stringify(payload, null, 2));
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          if (!data?.success) return;
          reset(PickListFormDefaults);
        },
      });
      return;
    }

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: formPickListId, data: payload,
        },
        {
          onSuccess: (data) => {
            if (!data?.success) return;
            onClose()
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
      title={`${mode} Pick List`}
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

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> Pick List Information </h2>

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
                <label className="block text-gray-700 font-medium mb-1">Picklist Date</label>
                <input
                  type="date"
                  {...register("picklistdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.picklistdt ? "text-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Picklist No</label>
                <input
                  type="text"
                  {...register("picklistno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`
                    inputField 
                    ${errors.picklistno ? "" : "border-gray-400"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                  placeholder="Enter pick list no."
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

              <div className="w-80">
                <label className="block text-gray-700 font-medium mb-1">  Tbill <span className="text-red-500"> *</span>  </label>

                <input
                  type="text"
                  readOnly
                  disabled={isReadOnly}
                  value={tbillid.length === 0 ? "" : `${tbillid.length} Tbill(s) Selected`}
                  placeholder="Select Tbill(s)"
                  onKeyDown={(e) => handleKeyOpen(e, () => setTbillModalOpen(true))}
                  onClick={() => !isReadOnly && setTbillModalOpen(true)}
                  className={`inputField w-full
                    ${errors.tbillid && tbillid.length === 0 ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                />
              </div>
              {selectedTbills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTbills.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {item.orderno}
                    </span>
                  ))}
                </div>
              )}

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
              <PickListItems
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

        {isSubmitting || isLoadingPickList && <Loader />}

      </form>


      <SearchModal
        open={godownModalOpen}
        onClose={() => setGodownModalOpen(false)}
        endpoint="godown"
        baseParams={baseGodownParams}
        columns={searchGodownColumns}
        searchFields={searchGodownFields}
        onSelect={handleGodownSelect}
      />

      <MultipleSearchModal
        open={tbillModalOpen}
        onClose={() => setTbillModalOpen(false)}
        endpoint="so"
        baseParams={baseTbillParams}
        columns={searchTbillColumns}
        searchFields={searchTbillFields}
        multiple
        selectedRows={selectedTbills}
        onSelect={() => { }}
        onMultiSelect={handleTbillSelect}
      />

    </Popup>
  );


}