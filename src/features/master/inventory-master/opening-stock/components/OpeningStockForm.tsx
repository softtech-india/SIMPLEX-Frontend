'use client';

import { useEffect, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useFieldArray } from "react-hook-form";
import useUserStore from "@/store/userStore";
import { useWatch } from "react-hook-form";
import { OpeningStockFormType, OperationMode } from "../types/openingStock.types";
import { useCreateOpeningStock, useDeleteOpeningStock, useOpeningStockById, useUpdateOpeningStock } from "../hooks/useOpeningStock";
import { useOpeningStockForm } from "../hooks/useOpeningStockForm";
import { OpeningStockItems } from "./OpeningStockItems";
import { OpeningStockFormSchema } from "../schemas/openingStock.schema";
import { openingStockFormDefaults } from "../constants/openingStockFormFormDefaults";
import SearchModal from "@/common/components/SearchModal";
import { useConfirm } from "@/common/hooks/useConfirm";

interface OpeningStockFormProps {
  visible: boolean;
  onClose: () => void;
  formOpeningStockId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;
}

export function OpeningStockForm({ visible, onClose, formOpeningStockId, mode, formSelectedBranch, toolbarBranchId }: OpeningStockFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const confirmDelete = useConfirm();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: OpeningStock, isLoading: isLoadingOpeningStock } =
    useOpeningStockById({
      id: formOpeningStockId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateOpeningStock();
  const updateMutation = useUpdateOpeningStock();
  const deleteMutation = useDeleteOpeningStock();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const [productModalOpen, setProductModalOpen] = useState(false);

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

  const productname = watch('productname');
  const categorynm = watch("categorynm");
  const classnm = watch("classnm");
  const unit = watch("unit");

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

  const avgRate = totalQty > 0 ? totalValue / totalQty : 0;

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("productid");
    }, 1000);

    if (isAddMode) {
      reset(openingStockFormDefaults);
      return;
    }

    if (OpeningStock) {
      reset({
        ...openingStockFormDefaults,

        ...OpeningStock,

        compid: Number(OpeningStock.compid ?? 0),
        branchid: Number(OpeningStock.branchid ?? 0),
        finid: Number(finid),

        productid: Number(OpeningStock.productid ?? 0),
        productname: OpeningStock.productnm,
        categorynm: OpeningStock.pcategorynm,
        qty1: Number(OpeningStock.qty1 ?? 0),
        qty2: Number(OpeningStock.qty2 ?? 0),

        itemdtl:
          OpeningStock.itemdtl?.map((item, index) => ({
            tag: item.tag ?? "I",
            dtlid: item.dtlid ?? index + 1,
            productid: item.productid,

            godownid: item.godownid,
            godownnm: item.godownnm,

            qty1: Number(item.qty1 ?? 0),
            qty2: Number(item.qty2 ?? 0),
            rate: Number(item.rate ?? 0),
            value: Number(item.value ?? 0),
          })) ?? [],
      });
    }
  }, [OpeningStock, isAddMode, reset, visible, setFocus]);

  // Model Search product Modal Handlers
  const baseProductParams = {
    userid: userId,
    compid: companyId,
  };

  const searchProductFields = [
    { value: "productname", label: "Name" },
    { value: "pclsname", label: "Class" },
    { value: "group", label: "Group" },
  ];

  const searchProductColumns = [
    { key: "productname", label: "Product" },
    { key: "categorynm", label: "Brand" },
    { key: "classnm", label: "Class" },
    { key: "subclassnm", label: "Sub Class" },
    { key: "unit", label: "Unit" },
    { key: "mrp", label: "Mrp" },
  ];

  const handleProductSelect = (row: any) => {
    setValue(`productid`, row.id);
    setValue(`productname`, row.productname);
    setValue("categorynm", row.categorynm);
    setValue("classnm", row.classnm);
    setValue("unit", row.unit);

    setProductModalOpen(false);
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
        //  productid: Number(item.productid ?? 0),
        godownid: Number(item.godownid ?? 0),
        qty1: Number(qty),
        qty2: Number(item?.qty2) || qty,
        rate: Number(rate),
        value: value,
      };
    });

    const avgRate = qty1 > 0 ? totprodval / qty1 : 0;

    return { qty1, totprodval, avgRate, itemdtl };
  };

  // Submit handler
  const handleFormSubmit = async (data: OpeningStockFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Opening Stock",
          message: "Are you sure you want to delete this Opening Stock?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formOpeningStockId,
          userid: Number(userId),
          compid: Number(companyId),
          branchid: toolbarBranchId,
          finid: Number(finid),
        });
        onClose();
        return;
      }

      const { qty1, totprodval, avgRate, itemdtl } = calculateTotals(data.itemdtl || []);

      const payload: OpeningStockFormType = {
        ...data,
        compid: companyId,
        branchid: toolbarBranchId,
        finid: Number(finid),
        qty1: Number(qty1),
        qty2: Number(qty1),
        rate: avgRate,
        value: totprodval,
        itemdtl,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(openingStockFormDefaults);
        //onClose();
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

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
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

          {/* Opening Stock Order Info */}
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Opening Stock Information
            </h2>

            <div className="flex flex-wrap gap-4 items-end">

              <div className="w-120">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Product <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={productname || ""}
                  readOnly
                  onClick={() => {
                    setProductModalOpen(true);
                  }}
                  className={`inputField w-full cursor-pointer ${errors?.productid ? "border-red-500" : "border-gray-400"}`}
                  placeholder="Select Product"
                />
                {errors?.productid && (
                  <p className="text-xs text-red-500 mt-1"> {errors.productid.message} </p>
                )}
              </div>

              <div className="w-68">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={categorynm || ""}
                  readOnly
                  className="inputField border-gray-400 bg-gray-100"
                />
              </div>

              <div className="w-68">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Class
                </label>
                <input
                  type="text"
                  value={classnm || ""}
                  readOnly
                  className="inputField border-gray-400 bg-gray-100"
                />
              </div>

              <div className="w-28">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit || ""}
                  readOnly
                  className="inputField border-gray-400 bg-gray-100"
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Branch </label>
                <input
                  type="text"
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 bg-gray-100`}
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
                      godownnm: '',
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
                  branchId={toolbarBranchId}
                  visible={visible}
                  isReadOnly={isReadOnly}
                  fieldsLength={fields.length}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center border-t pt-3">

              <div className="w-68" />

              <div className="w-28 relative">
                <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total
                </span>
                <input
                  type="number"
                  value={totalQty}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>

              <div className="w-28 relative">
                <input
                  type="number"
                  value={Number(avgRate).toFixed(2)}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>

              <div className="w-28 relative">
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
          visible={isSubmitting || isLoadingOpeningStock}
          showIndicator
        />
      </form>

      <SearchModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        endpoint="product"
        baseParams={baseProductParams}
        columns={searchProductColumns}
        searchFields={searchProductFields}
        onSelect={handleProductSelect}
      />

    </Popup>
  );


}