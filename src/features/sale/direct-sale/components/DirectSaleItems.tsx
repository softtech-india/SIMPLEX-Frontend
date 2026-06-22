import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { fetchProductStock } from "@/api/master/product-api";
import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { LOOKUP_KEYS } from "@/common/constants/lookupKeys";
import { useLookupShortcuts } from "@/common/hooks/useLookupShortcuts";


type DirectSaleItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  errors: any;
  setValue: any;
  setFocus?: any;
  remove: (index: number) => void;
  trigger: any;
  watchedItems: any;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
  billdt: string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
  excludeIds?: number[];
  currentId?: number;
  brandInputRef?: (el: HTMLInputElement | null) => void;
};

export const DirectSaleItems: React.FC<DirectSaleItemsProps> = ({
  index,
  field,
  control,
  register,
  errors,
  setValue,
  setFocus,
  remove,
  trigger,
  watchedItems,
  userId,
  companyId,
  branchId,
  billdt,
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


  const selectedProductId = item?.productid;

  const { data: currentProductStock } = useQuery({
    queryKey: ["fetchProductStock", userId, companyId, branchId, selectedProductId, billdt],
    queryFn: () => fetchProductStock(userId, companyId, branchId, selectedProductId, billdt),
    enabled: !!userId && !!companyId && !!branchId && !!selectedProductId && !!billdt,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!currentProductStock?.length) return;

    const stockData = currentProductStock[0];
    const clqty = Number(stockData?.clqty || 0);
    const currentQty = Number(watchedItems?.[index]?.qty1 || 1);
    const clrate = Number(stockData?.clrate || 0);

    setValue(`itemdtl.${index}.clqty`, clqty);

    // Get current form rate
    // const existingRate = Number(watchedItems?.[index]?.rate || 0);
    // Only set default rate if empty/not entered yet
    // if (!existingRate) {
    //   setValue(`itemdtl.${index}.rate`, clrate);
    // }

    if (clqty === 0) {
      setValue(`itemdtl.${index}.qty1`, 0);
      toast.error("This product is out of stock");
      return;
    }
    if (currentQty > clqty) {
      setValue(`itemdtl.${index}.qty1`, clqty);
      toast.error(`Qty adjusted to available stock (${clqty})`);
    }

  }, [currentProductStock, index, setValue]);

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

    setValue(`itemdtl.${index}.rate`, 0);
    setValue(`itemdtl.${index}.clqty`, 0);
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
    // setValue(`itemdtl.${index}.qty1`, 0);
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
    <>
      <tr className="border-b">

        <td className="border p-1 w-68">
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
        </td>

        <td className="border p-1 w-80">
          <input
            type="text"
            value={item?.productnm || ""}
            readOnly

            {...bindLookup(LOOKUP_KEYS.product)}
            ref={(e) => {
              register(`itemdtl.${index}.pcategoryid`).ref(e);
              productRef.current = e;
            }}
            onKeyDown={(e) => handleKeyOpen(e, () => setProductModalOpen(true))}
            onClick={() => {
              if (!item?.pcategoryid) return;
              setProductModalOpen(true);
            }}
            disabled={isReadOnly || !item?.pcategoryid}
            className={`
              inputField w-full cursor-pointer 
              ${isReadOnly || !item?.pcategoryid ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ""}
            `}
            placeholder="Select Product"
          />
          {errors?.itemdtl?.[index]?.productid && (
            <p className="text-xs text-red-500 mt-1">  {errors.itemdtl[index].productid.message} </p>
          )}
        </td>

        <td className="border p-1 w-14">
          <input
            type="number"
            min={0}
            {...register(`itemdtl.${index}.qty1`, {
              valueAsNumber: true,
              onChange: (e: any) => {
                let value = Number(e.target.value);

                if (value < 0) value = 0;
                const clqty = Number(watchedItems?.[index]?.clqty) || 0;
                if (value > clqty) {
                  toast.error("Quantity cannot exceed closing stock");
                  value = clqty;
                }

                setValue(`itemdtl.${index}.qty1`, value);
              },
            })}
            disabled={isReadOnly || !item?.pcategoryid}
            className={`inputField 
              ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-400"}
              ${isReadOnly || !item?.pcategoryid ? 'bg-gray-200 cursor-not-allowed border-gray-300' : ""}
            `}
            onKeyDown={(e) => {
              if (e.key === "-") e.preventDefault();
            }}
          />
          {/* {errors?.itemdtl?.[index]?.qty1 && ( <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].qty1.message}</p> )} */}
        </td>

        <td className="border p-1 w-28">
          <Controller
            control={control}
            name={`itemdtl.${index}.rate`}
            render={({ field }) => (
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.000000"
                value={field.value ?? ""}

                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");
                  if (parts.length > 2) return;

                  const integerPart = parts[0] || "";
                  const decimalPart = parts[1] || "";

                  if (integerPart.length > 12) return;
                  if (decimalPart.length > 6) return;

                  field.onChange(value);
                }}

                onBlur={() => {
                  const numericValue = Number(field.value || 0);
                  field.onChange(numericValue);
                }}

                className={`inputField ${errors?.itemdtl?.[index]?.rate ? "border-red-500" : "border-gray-400"}`}
              />
            )}
          />
          {/* {errors?.itemdtl?.[index]?.rate && (<p className="text-xs text-red-500 mt-1">{errors.itemdtl[index].rate.message} </p>)} */}
        </td>

        <td className="border p-1 w-28">
          <input
            type="number"
            tabIndex={-1}
            value={Number(value.toFixed(2))}
            readOnly
            className="inputField  bg-gray-100 border-gray-400"
          />
        </td>

        <td className="border p-1 w-14">
          <input
            type="number"
            tabIndex={-1}
            min={0}
            {...register(`itemdtl.${index}.clqty`)}
            readOnly
            className="inputField  bg-gray-100 border-gray-400"
          />
        </td>

        {!isReadOnly && (
          <td className="w-12 text-center align-middle">
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fieldsLength === 1}
              className={`inline-flex items-center justify-center p-2 rounded
                ${fieldsLength === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"} 
              `}
            >
              <Trash2 size={16} />
            </button>
          </td>
        )}

      </tr>

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
    </>
  );


};