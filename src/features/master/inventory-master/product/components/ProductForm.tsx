import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useCreateProduct, useUpdateProduct, useDeleteProduct, useProduct } from "../hooks/product";
import { HSN, OperationMode, ProductFormData, ProdUnit } from "../types/product.types";
import { ProductSchema, ProductFormSchema } from "../schemas/product.schema";
import { ProductDefaultValues } from "../constants/product"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product";
import { productStatus, productType } from "@/common/utility/data";
import { useMasterModal } from "@/hooks/useMasterModal";
import useUserStore from "@/store/userStore";
import SearchModal from "@/common/components/SearchModal";
import Loader from "@/common/components/Loader";
import focusNext from "@/helpers/focusNext";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import { Save, XCircle } from "lucide-react";

interface ProdFormProps {
  visible: boolean;
  onClose: () => void;
  ProductId: number;
  mode: OperationMode;
  returnAfterSave?: boolean;
  onSuccess?: (product: any) => void;
}

type Option = { value: number | string; label: string };


export function ProductForm({ visible, onClose, ProductId, mode, returnAfterSave, onSuccess }: ProdFormProps) {

  // Hooks
  const { userId, companyId, branchId, finid, } = useUserStore();
  const { open } = useMasterModal();
  const confirm = useConfirm();

  // state
  const formRef = useRef<HTMLFormElement>(null);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [hsnFormOpen, setHsnFormOpen] = useState(false);
  const [showFilterRow, setShowFilterRow] = useState(false);

  const mrpInputRef = useRef<HTMLInputElement>(null);

  // ---- Refs for focus chaining ----
  const categoryRef = useRef<HTMLInputElement>(null);
  const classRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLInputElement>(null);
  const hsnRef = useRef<HTMLInputElement>(null);
  const gstRef = useRef<HTMLInputElement | null>(null);

  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  // Query
  const { data: Productlist, isLoading: isLoadingProduct } = useProduct(ProductId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // React Hooks Form
  const {
    control, register, handleSubmit, setFocus, setValue, reset, watch, formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValues,
  });


  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );
  // ---- Display values ----
  const categoryName = watch("categorynm");
  const className = watch("classnm");
  const groupName = watch("subclassnm");
  const hsnName = watch("hsn") || watch('hsnNo');
  const selectedCategoryId = watch("productcategoryid");
  const selectedClassId = watch("productclassid");

  // ---- Create-new handlers ----
  const handleCreateProdcategory = async () => { await open("prodcategory"); };
  const handleCreateProdclass = async () => { await open("prodclass"); };
  const handleCreateProdgroup = async () => { await open("prodgroup"); };
  const handleCreateHsn = async () => { await open("hsn"); };

  // ---- Shared config ----
  const baseParams = { userid: userId, compid: companyId };
  const nameColumns = [{ key: "name", label: "Name" }];
  const nameFields = [{ value: "name", label: "Name" }];


  // ---- Category ----
  const handleCategorySelect = (row: any) => {
    if (row.id !== selectedCategoryId) {
      // parent changed -> clear children
      setValue("productclassid", 0);
      setValue("classnm", "");
      setValue("productsubclassid", 0);
      setValue("subclassnm", "");
    }
    setValue("productcategoryid", row.id, { shouldValidate: true });
    setValue("categorynm", row.name);
    setCategoryFormOpen(false);
    focusNext(classRef);
  };

  // ---- Class (filtered by category) ----
  const baseClassParams = { ...baseParams, categoryid: selectedCategoryId };

  const handleClassSelect = (row: any) => {
    if (row.id !== selectedClassId) {
      setValue("productsubclassid", 0);
      setValue("subclassnm", "");
    }
    setValue("productclassid", row.id, { shouldValidate: true });
    setValue("classnm", row.name);
    setClassFormOpen(false);
    focusNext(groupRef);
  };

  // ---- Product Group (filtered by class) ----
  const baseGroupParams = { ...baseParams, classid: selectedClassId };

  const handleGroupSelect = (row: any) => {
    setValue("productsubclassid", row.id, { shouldValidate: true });
    setValue("subclassnm", row.name);
    setGroupFormOpen(false);
    focusNext(hsnRef);
  };

  // ---- HSN ----
  const searchHsnColumns = [
    { key: "hsn", label: "HSN Code" },
    { key: "description", label: "Description" },
  ];
  const searchHsnFields = [
    { value: "hsn", label: "HSN Code" },
    { value: "description", label: "Description" },
  ];

  const handleHsnSelect = (row: any) => {
    console.log('HSN :', row)
    setValue("hsnid", row.id, { shouldValidate: true });
    setValue("hsn", row.hsn);
    handleHsnChange(row); // keep your existing tax/GST logic
    setHsnFormOpen(false);
    requestAnimationFrame(() => {
      mrpInputRef.current?.focus();
    });
  };

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


  const { data: prodUnits = [] } = useQuery({
    queryKey: ["prodUnits", userId],
    queryFn: () => productService.getAllProdUnits(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });


  const unitOptions: Option[] = useMemo(
    () =>
      prodUnits.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [prodUnits]
  );


  const gstOptions: Option[] = useMemo(
    () =>
      gsts.map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [gsts]
  );


  const productTypeOptions: Option[] = useMemo(
    () => productType.map((s) => ({ value: s.id, label: s.name })),
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

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };

  // Submit handler
  const handleFormSubmit = async (data: ProductFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product group",
          message: "Are you sure you want to delete this HSN?",
          confirmText: "Delete",
          variant: "danger",
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
        const result = await createMutation.mutateAsync(payload);
        reset(ProductDefaultValues);
        // onClose();
        if (returnAfterSave) {
          onSuccess?.(result);
          onClose();
          return;
        }
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

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setShowFilterRow(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowFilterRow(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, []);
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
      title={`${mode} Product`}
      width="95vw"
      height="50vh"
      dragEnabled={false}
      showTitle={false}
      showCloseButton={false}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-1">

          <div className="flex-none border-b rounded border-gray-300 p-2 flex items-center justify-between text-white bg-[#0f1c7f]">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold ">Product</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>

          <section className="border rounded-md p-1 shadow-sm bg-white">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
              <div>
                <label className="block text-gray-700 font-medium mb-1">  Product Code </label>
                <input
                  type="text"
                  {...register("productcode")}
                  disabled={isReadOnly || true}
                  className={`inputField w-full border ${errors.productcode ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product code"
                />

              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Name <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="text"
                  {...register("productname")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.productname ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Print Name <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="text"
                  {...register("aliasname")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.aliasname ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product print name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category <strong className="text-red-500">*</strong>
                </label>
                <input
                  ref={categoryRef}
                  type="text"
                  value={categoryName || ""}
                  disabled={isReadOnly}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setCategoryFormOpen(true))}
                  onClick={() => setCategoryFormOpen(true)}
                  className={`inputField w-full border
                    ${errors.productcategoryid && !categoryName ? "border-red-500" : "border-gray-300"} 
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder="Select Category"
                />

              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Class <strong className="text-red-500">*</strong>
                </label>
                <input
                  ref={classRef}
                  type="text"
                  value={className || ""}
                  disabled={isReadOnly || !selectedCategoryId}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setClassFormOpen(true))}
                  onClick={() => selectedCategoryId && setClassFormOpen(true)}
                  className={`inputField w-full border
                    ${errors.productclassid && !className ? "border-red-500" : "border-gray-300"} 
                    ${isReadOnly || !selectedCategoryId ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder={
                    selectedCategoryId ? "Select Class" : "Select Category first"
                  }
                />

              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Group <strong className="text-red-500">*</strong>
                </label>
                <input
                  ref={groupRef}
                  type="text"
                  value={groupName || ""}
                  disabled={isReadOnly || !selectedClassId}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setGroupFormOpen(true))}
                  onClick={() => selectedClassId && setGroupFormOpen(true)}
                  className={`inputField w-full border
                    ${errors.productsubclassid && !groupName ? "border-red-500" : "border-gray-300"} 
                    ${isReadOnly || !selectedClassId ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder={selectedClassId ? "Select Product Group" : "Select Class first"}
                />

              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  HSN <strong className="text-red-500">*</strong>
                </label>
                <input
                  ref={hsnRef}
                  type="text"
                  value={hsnName || ""}
                  disabled={isReadOnly}
                  readOnly
                  onKeyDown={(e) => handleKeyOpen(e, () => setHsnFormOpen(true))}
                  onClick={() => setHsnFormOpen(true)}
                  className={`inputField w-full border
                    ${errors.hsnid && !hsnName ? "border-red-500" : "border-gray-300"}
                     ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder="Select HSN"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Base Unit  </label>
                <FormSelect
                  name="unitid"
                  control={control}
                  options={unitOptions}
                  onChange={handleUnitChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Product Type  </label>
                <FormSelect
                  name="producttype"
                  control={control}
                  options={productTypeOptions}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> MRP </label>
                <input
                  type="text"
                  {...register("mrp", { valueAsNumber: true })}
                  autoComplete="off"
                  // ref={(e) => { mrpInputRef.current = e; }}
                  disabled={isReadOnly}
                  className={`inputField w-full border
                    ${errors.mrp ? "border-red-500" : "border-gray-300"}
                     ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  placeholder="Enter MRP"

                />
                {errors.mrp && <p className="text-red-500 mt-1 text-sm">{errors.mrp.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  GST <strong className="text-red-500">*</strong>
                </label>
                <FormSelect
                  name="gstid"
                  control={control}
                  options={gstOptions}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Status </label>
                <FormSelect
                  name="closedtag"
                  control={control}
                  options={productStatusOption}
                />
              </div>
            </div>

          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 px-4 py-2.5 flex justify-end gap-4 bg-white">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={15} /> {isSubmitting ? "Saving..." : getButtonLabel()}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={15} />  Exit
          </button>

        </div>


        {(isSubmitting || isLoadingProduct) && <Loader />}

      </form>


      <SearchModal
        open={categoryFormOpen}
        onClose={() => setCategoryFormOpen(false)}
        endpoint="category"
        baseParams={baseParams}
        columns={nameColumns}
        searchFields={nameFields}
        onSelect={handleCategorySelect}
        createNewConfig={{ enabled: true, label: "Create New Category", onCreateNew: handleCreateProdcategory }}
      />

      <SearchModal
        open={classFormOpen}
        onClose={() => setClassFormOpen(false)}
        endpoint="class"
        baseParams={baseClassParams}
        columns={nameColumns}
        searchFields={nameFields}
        onSelect={handleClassSelect}
        createNewConfig={{ enabled: true, label: "Create New Class", onCreateNew: handleCreateProdclass }}
      />

      <SearchModal
        open={groupFormOpen}
        onClose={() => setGroupFormOpen(false)}
        endpoint="productsubclass"
        baseParams={baseGroupParams}
        columns={nameColumns}
        searchFields={nameFields}
        onSelect={handleGroupSelect}
        createNewConfig={{ enabled: true, label: "Create New Product Group", onCreateNew: handleCreateProdgroup }}
      />

      <SearchModal
        open={hsnFormOpen}
        onClose={() => setHsnFormOpen(false)}
        endpoint="hsn"
        baseParams={baseParams}
        columns={searchHsnColumns}
        searchFields={searchHsnFields}
        onSelect={handleHsnSelect}
        createNewConfig={{ enabled: true, label: "Create New HSN", onCreateNew: handleCreateHsn }}
      />

    </Popup>
  );
}