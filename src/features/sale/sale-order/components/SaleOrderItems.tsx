import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { useLookupShortcuts } from "@/common/hooks/useLookupShortcuts";


type SaleOrderItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  errors: any;
  setValue: any;
  setFocus: any;
  remove: (index: number) => void;
  watchedItems: any;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
  excludeIds?: number[];
  currentId?: number;
  brandInputRef?: (el: HTMLInputElement | null) => void;

};

export const SaleOrderItems: React.FC<SaleOrderItemsProps> = ({
  index,
  field,
  control,
  register,
  errors,
  setValue,
  setFocus,
  remove,
  watchedItems,
  userId,
  companyId,
  branchId,
  visible,
  isReadOnly,
  fieldsLength,
  excludeIds,
  currentId,
  brandInputRef

}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const productRef = useRef<HTMLInputElement>(null);


  // Model Search Brand Modal Handlers
  const baseBrandParams = {
    userid: userId,
    compid: companyId,
  };

  const searchBrandColumns = [
    { key: "name", label: "Brand Name" },
  ];

  const searchBrandFields = [
    { value: "name", label: "Name" },
  ];

  const handleBrandSelect = (row: any) => {
    setValue(`itemdtl.${index}.pcategoryid`, row.id);
    setValue(`itemdtl.${index}.pcategorynm`, row.name);
    setValue(`itemdtl.${index}.productid`, null);
    setValue(`itemdtl.${index}.productnm`, "");
    setBrandModalOpen(false);
    setTimeout(() => {
      productRef.current?.focus();
    }, 100);
  };

  // Model Search product Modal Handlers
  const baseProductParams = {
    userid: userId,
    compid: companyId,
    brand: item?.pcategoryid,
  };

  const searchProductFields = [
    { value: "productname", label: "Name" },
    { value: "pclsname", label: "Class" },
    { value: "group", label: "Group" },
  ];

  const searchProductColumns = [
    { key: "productname", label: "Product" },
    { key: "classnm", label: "Class" },
    { key: "subclassnm", label: "Sub Class" },
    { key: "unit", label: "Unit" },
    { key: "mrp", label: "Mrp" },
  ];

  const handleProductSelect = (row: any) => {
    const alreadyExists = watchedItems?.some(
      (item: any) => item?.productid === row.id
    );

    if (alreadyExists) {
      toast.error("Brand already selected");
      return;
    }

    setValue(`itemdtl.${index}.productid`, row.id);
    setValue(`itemdtl.${index}.productnm`, row.productname);
    setProductModalOpen(false);
    requestAnimationFrame(() => {
      setFocus(`itemdtl.${index}.qty1`);
    });
  };

  const lookupMap = {
    product: () => setProductModalOpen(true),
  };

  const bindLookup = useLookupShortcuts(isReadOnly, lookupMap);

  const handleKeyOpen = (e: React.KeyboardEvent, openFn: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFn();
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700 font-medium mb-1"> Brand <strong className="text-red-500"> * </strong> </label>
        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          ref={brandInputRef}
          onKeyDown={(e) => handleKeyOpen(e, () => setBrandModalOpen(true))}
          onClick={() => setBrandModalOpen(true)}
          className="inputField w-full cursor-pointer border border-gray-400"
          placeholder="Select Brand"
        />
      </div>

      <div className="w-120">
        <label className="block text-gray-700 font-medium mb-1"> Product <strong className="text-red-500"> * </strong> </label>
        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
          ref={(e) => {
            register(`itemdtl.${index}.pcategoryid`).ref(e);
            productRef.current = e;
          }}
          onKeyDown={(e) => handleKeyOpen(e, () => setProductModalOpen(true))}
          onClick={() => {
            if (!item?.pcategoryid) return;
            setProductModalOpen(true);
          }}
          className={`
            inputField w-full cursor-pointer 
            ${errors?.itemdtl?.[index]?.productid && !item?.productid ? "border-red-500" : "border-gray-400"}
          `}
          placeholder="Select Product"
        />
        {/* {errors?.itemdtl?.[index]?.productid && !item?.productid && (
          <p className="text-xs text-red-500 mt-1">  {errors.itemdtl[index].productid.message} </p>
        )} */}
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Quantity <strong className="text-red-500"> * </strong> </label>
        <input
          type="number"
          {...register(`itemdtl.${index}.qty1`, { valueAsNumber: true })}
          disabled={isReadOnly}
          className={`inputField ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-400"}`}
        />
        {/* {errors?.itemdtl?.[index]?.qty1 && (
          <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].qty1.message}</p>
        )} */}
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Rate</label>
        <input
          type="number"
          {...register(`itemdtl.${index}.rate`, { valueAsNumber: true })}
          disabled={isReadOnly}
          className="inputField border-gray-400 "
        />
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Value</label>
        <input
          type="number"
          tabIndex={-1}
          value={value}
          readOnly
          className="inputField  bg-gray-100 border-gray-400"
        />
      </div>

      {!isReadOnly && (
        <div className="w-12 flex justify-center">
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fieldsLength === 1}
            className={`px-2 py-2 rounded flex items-center justify-center
            ${fieldsLength === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-red-600 text-white"
              }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* MODALS */}
      <SearchModal
        open={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        endpoint="category"
        baseParams={baseBrandParams}
        columns={searchBrandColumns}
        searchFields={searchBrandFields}
        onSelect={handleBrandSelect}

      />

      <SearchModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        endpoint="product"
        baseParams={baseProductParams}
        columns={searchProductColumns}
        searchFields={searchProductFields}
        onSelect={handleProductSelect}
        excludeIds={excludeIds}
        currentId={currentId}
      />
    </div>
  );


};