import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import { useHSNs } from "../hooks/product";
import { useCreateProduct, useUpdateProduct, useDeleteProduct, useProduct } from "../hooks/product";

import { HSN, OperationMode, ProductFormData, ProdUnit } from "../types/product.types";
import { ProductSchema, ProductFormSchema } from "../schemas/product.schema";
import { ProductDefaultValues } from "../constants/product"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { productService } from "../services/product";
import { batchRequire, goodsServiceType, productStatus, productType, purchaseRateOn, salesRateOn, unitFactorType, unitMethod, valuationType } from "@/common/utility/data";

interface ProdFormProps {
  visible: boolean;
  onClose: () => void;
  ProductId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function ProductForm({ visible, onClose, ProductId, mode }: ProdFormProps) {
  const userId = getStorageItem("userId");
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";
  const { data: Productlist, isLoading: isLoadingProduct } = useProduct(ProductId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValues,
  });

  const { data: gsts = [] } = useQuery({
    queryKey: ["gsts", userId],
    queryFn: () => productService.getAllGSTs(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: hsns = [] } = useQuery({
    queryKey: ["hsns", userId],
    queryFn: () => productService.getAllHSNs(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => productService.getAllCategories(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: prodClasses = [] } = useQuery({
    queryKey: ["prodClasses", userId],
    queryFn: () => productService.getAllProdClasses(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: prodGroups = [] } = useQuery({
    queryKey: ["prodGroups", userId],
    queryFn: () => productService.getAllProdGroups(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: prodUnits = [] } = useQuery({
    queryKey: ["prodUnits", userId],
    queryFn: () => productService.getAllProdUnits(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const categoryOptions: Option[] = useMemo(
    () =>
      categories.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [categories]
  );

  const classOptions: Option[] = useMemo(
    () =>
      prodClasses.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [prodClasses]
  );

  const groupOptions: Option[] = useMemo(
    () =>
      prodGroups.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [prodGroups]
  );

  const unitOptions: Option[] = useMemo(
    () =>
      prodUnits.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [prodUnits]
  );

  const hsnOptions: Option[] = useMemo(
    () =>
      hsns.map((c: any) => ({
        value: c.id,
        label: c.hsn,
      })),
    [hsns]
  );

  const gstOptions: Option[] = useMemo(
    () =>
      gsts.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [gsts]
  );

  const GoodServiceOptions: Option[] = useMemo(
    () => goodsServiceType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const productTypeOptions: Option[] = useMemo(
    () => productType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const valuationTypeOptions: Option[] = useMemo(
    () => valuationType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const batchRequireOptions: Option[] = useMemo(
    () => batchRequire.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const unitFactorTypeOptions: Option[] = useMemo(
    () => unitFactorType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const unitMethodOptions: Option[] = useMemo(
    () => unitMethod.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const purchaseRateONOptions: Option[] = useMemo(
    () => purchaseRateOn.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const saleRateONOptions: Option[] = useMemo(
    () => salesRateOn.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const productStatusOption: Option[] = useMemo(
    () => productStatus.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("productname");
    }, 1000);

    if (mode === "Add") {
      reset(ProductDefaultValues);
      return;
    }


    if (Productlist) {
      reset({
        ...Productlist,


      });
    }
  }, [Productlist, gsts.length, mode, visible]);
  // Submit handler
  const handleFormSubmit = async (data: ProductFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this HSN?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(ProductId);
        onClose();
        return;
      }

      const payload: ProductFormData = {
        ...data,
        alterunitfactor: data.alterunitfactor ?? 1,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(ProductDefaultValues);
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: ProductId,
          data: payload,
        });
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleHsnChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;

    const selectedHsn = hsns.find((h: HSN) => h.id === selectedOption.value);

    if (selectedHsn) {
      // ✅ update form values properly
      setValue("hsnid", selectedHsn.id);
      setValue("gstid", selectedHsn.gstid);
    }
  };

  const alterUnitId = watch("alterunitid");
  const handleUnitChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;

    const selectedUnit = prodUnits.find((p: ProdUnit) => p.id === selectedOption.value);

    if (selectedUnit) {
      // ✅ update form values properly
      setValue("unitid", selectedUnit.id);
      if (!alterUnitId) {

        setValue("alterunitid", selectedUnit.id);
      }
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
      title={`${mode} Product`}
      width="97vw"
      height="84vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Product Information */}
          <section className="border rounded-md p-2  shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-4">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-4 border-b-3 border-[#7f7db0]">
                {/* Product Code */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Product Code<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    {...register("productcode")}
                    disabled={isReadOnly || true}

                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.productcode ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter productcode"
                  />
                  {errors.productcode && <p className="text-red-500 mt-1 text-sm">{errors.productcode.message}</p>}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Product Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    {...register("productname")}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.productname ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter product description"
                  />
                  {errors.productname && <p className="text-red-500 mt-1 text-sm">{errors.productname.message}</p>}
                </div>
                {/* Print Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Print Name<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    {...register("aliasname")}
                    disabled={isReadOnly}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.aliasname ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter product print name"
                  />
                  {errors.aliasname && <p className="text-red-500 mt-1 text-sm">{errors.aliasname.message}</p>}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="pr-2 border-r-3">
                  {/* Category */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Category</label>
                    <FormSelect
                      name="productcategoryid"
                      control={control}
                      options={categoryOptions}
                    />
                  </div>

                  {/* Class */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Class</label>
                    <FormSelect
                      name="productclassid"
                      control={control}
                      options={classOptions}
                    />
                  </div>

                  {/* Product Group */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Product Group</label>
                    <FormSelect
                      name="productsubclassid"
                      control={control}
                      options={groupOptions}
                    />
                  </div>

                  {/* Base Unit */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Base Unit</label>
                    <FormSelect
                      name="unitid"
                      control={control}
                      options={unitOptions}
                      onChange={handleUnitChange}
                    />
                  </div>

                  {/* Product Type */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Product Type</label>
                    <FormSelect
                      name="producttype"
                      control={control}
                      options={productTypeOptions}
                    />
                  </div>
                </div>

                <div className="pr-2 border-r-3">

                  {/* Minimum Level */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Minimum Level<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      {...register("minimumlevel", { valueAsNumber: true })}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.minimumlevel ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter minimum level"
                    />
                    {errors.minimumlevel && <p className="text-red-500 mt-1 text-sm">{errors.minimumlevel.message}</p>}
                  </div>

                  {/* Reorder Level */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Reorder Level<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      {...register("reorderlevel", { valueAsNumber: true })}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.reorderlevel ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter minimum level"
                    />
                    {errors.reorderlevel && <p className="text-red-500 mt-1 text-sm">{errors.reorderlevel.message}</p>}
                  </div>

                  {/* Valuation Type */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Valuation Type</label>
                    <FormSelect
                      name="valuationtype"
                      control={control}
                      options={valuationTypeOptions}
                    />
                  </div>

                  {/* Batch Require */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Batch Require</label>
                    <FormSelect
                      name="batchrequire"
                      control={control}
                      options={batchRequireOptions}
                    />
                  </div>
                </div>
                <div className="pr-2 border-r-3">

                  {/* Alter Unit */}

                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Alter Unit</label>
                    <FormSelect
                      name="alterunitid"
                      control={control}
                      options={unitOptions}
                    />
                  </div>

                  {/* Alter Unit Factor */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Alter Unit Factor<span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      {...register("alterunitfactor", { valueAsNumber: true })}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.alterunitfactor ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter minimum level"
                    />
                    {errors.alterunitfactor && <p className="text-red-500 mt-1 text-sm">{errors.alterunitfactor.message}</p>}
                  </div>

                  {/* Alter Unit Factor Type */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Alter Unit Factor Type</label>
                    <FormSelect
                      name="alterunitfactortype"
                      control={control}
                      options={unitFactorTypeOptions}
                    />
                  </div>
                  {/* Alter Unit Method */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Alter Unit Method</label>
                    <FormSelect
                      name="alterunitmethod"
                      control={control}
                      options={unitMethodOptions}
                    />
                  </div>
                  {/* Purchase Rate On */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Purchase Rate On</label>
                    <FormSelect
                      name="purchaserateon"
                      control={control}
                      options={purchaseRateONOptions}
                    />
                  </div>

                  {/* Sale Rate On */}

                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Sale Rate On</label>
                    <FormSelect
                      name="salerateon"
                      control={control}
                      options={saleRateONOptions}
                    />
                  </div>
                </div>
                <div>
                  {/* MRP */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">MRP<span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      {...register("mrp", { valueAsNumber: true })}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.mrp ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter minimum level"
                    />
                    {errors.mrp && <p className="text-red-500 mt-1 text-sm">{errors.mrp.message}</p>}
                  </div>

                  {/* HSN */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">HSN</label>
                    <FormSelect
                      name="hsnid"
                      control={control}
                      options={hsnOptions}
                      onChange={handleHsnChange}
                    />
                  </div>
                  {/* GST */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">GST</label>
                    <FormSelect
                      name="gstid"
                      control={control}
                      options={gstOptions}
                    />
                  </div>

                  {/* Status */}
                  <div className="">
                    <label className="block text-gray-700 font-medium mb-1">Status</label>
                    <FormSelect
                      name="closedtag"
                      control={control}
                      options={productStatusOption}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>


        </div>

        {/* Footer delete-btn */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? isDeleteMode ? "Deleting..." : "Saving..."
                : isDeleteMode ? "Delete" : "Save"
              }
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingProduct} showIndicator />
      </form>
    </Popup>
  );
}