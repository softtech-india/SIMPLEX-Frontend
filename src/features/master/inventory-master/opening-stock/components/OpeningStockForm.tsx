'use client';

import { useEffect } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { fetchVendorList } from "@/api/master/ledger-api";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { useWatch } from "react-hook-form";
import { formatDateForInput } from "@/helpers/dateUtils";
import { OpeningStockFormType, OperationMode } from "../types/openingStock";
import { useCreateOpeningStock, useDeleteOpeningStock, useOpeningStockById, useUpdateOpeningStock } from "../hooks/useOpeningStock";
import { useOpeningStockForm } from "../hooks/useOpeningStockForm";
import { pruchaseOrderFormDefaults } from "@/features/purchase/purchase-order/constants/pruchaseOrderFormDefaults";
import { OpeningStockItems } from "./OpeningStockItems";
import { OpeningStockFormSchema } from "../schemas/openingStock.schema";


interface OpeningStockFormProps {
  visible: boolean;
  onClose: () => void;
  formOpeningStockId: number;
  mode: OperationMode;
  formSelectedBranch: string;
}

export function OpeningStockForm({ visible, onClose, formOpeningStockId, mode, formSelectedBranch }: OpeningStockFormProps) {

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

  const { data: OpeningStock, isLoading: isLoadingOpeningStock } =
    useOpeningStockById({
      id: formOpeningStockId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: branchId,
      finid: Number(finid),
    });

  const createMutation = useCreateOpeningStock();
  const updateMutation = useUpdateOpeningStock();
  const deleteMutation = useDeleteOpeningStock();

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
  } = useOpeningStockForm();

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
      setFocus("productid");
    }, 1000);

    if (isAddMode) {
      reset(pruchaseOrderFormDefaults);
      return;
    }

    if (OpeningStock) {
      reset({
        ...pruchaseOrderFormDefaults,

        ...OpeningStock,

        compid: Number(OpeningStock.compid ?? 0),
        branchid: Number(OpeningStock.branchid ?? 0),
        finid: Number(OpeningStock.finid ?? 0),
        productid: Number(OpeningStock.productid ?? 0),

        qty1: Number(OpeningStock.qty1 ?? 0),
        qty2: Number(OpeningStock.qty2 ?? 0),

        itemdtl:
          OpeningStock.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            pcategoryid: item.godownid,
            pcategorynm: item.pcategorynm,
            productid: item.productid,
            productnm: item.productnm,
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
  }, [OpeningStock, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
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
  const handleFormSubmit = async (data: OpeningStockFormSchema) => {
    try {
      if (isDeleteMode) {
        if (!window.confirm("Delete this OpeningStock?")) return;
        await deleteMutation.mutateAsync(formOpeningStockId);
        onClose();
        return;
      }

      const { qty1, totprodval, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: OpeningStockFormType = {
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

      // console.log("FINAL SUBMIT PAYLOAD:", JSON.stringify(payload, null, 2));

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(pruchaseOrderFormDefaults);
        onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formOpeningStockId,
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
      title={`${mode} OpeningStock`}
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
              Purchase Order Information - {formSelectedBranch}
            </h2>

            <div className="flex flex-wrap gap-4 items-end">

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Product</label>
                <FormSelect
                  name="vnumid"
                  control={control}
                  options={seriesNoOptions}
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
                      godownid: 0,
                      qty1: 0,
                      rate: 0,
                      value: 0,
                      qty2: 0,
                      tag: "I",
                      dtlid: fields.length + 1,
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
                <OpeningStockItems
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
          visible={isSubmitting || isLoadingOpeningStock}
          showIndicator
        />
      </form>
    </Popup>
  );


}