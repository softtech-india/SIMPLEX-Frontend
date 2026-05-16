import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { OperationMode } from "../types/directSale.types";
import { useQuery } from "@tanstack/react-query";
import { fetchProductStock } from "@/api/master/product-api";
import { Controller } from "react-hook-form";


type OrderbasedSaleItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  errors: any;
  setValue: any;
  remove: (index: number) => void;
  trigger: any;
  watchedItems: any;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
  finid: number | string;
  orderid: number | string;
  billdt: string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;

  mode: OperationMode;

  excludeIds?: number[];
  currentId?: number;
};

export const OrderbasedSaleItems: React.FC<OrderbasedSaleItemsProps> = ({
  index,
  field,
  control,
  register,
  errors,
  setValue,
  remove,
  trigger,
  watchedItems,
  userId,
  companyId,
  branchId,
  finid,
  orderid,
  billdt,
  visible,
  isReadOnly,
  fieldsLength,

  mode,

  excludeIds,
  currentId

}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

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
    const clrate = Number(stockData?.clrate || 0);

    setValue(`itemdtl.${index}.clqty`, clqty);

    // const existingRate = Number(watchedItems?.[index]?.rate || 0);
    // if (!existingRate) {
    //   setValue(`itemdtl.${index}.rate`, clrate);
    // }

    const balanceqty1 = Number(watchedItems?.[index]?.balanceqty1) || 0;
    const currentQty = Number(watchedItems?.[index]?.qty1 || 1);
    const maxQty = Math.min(balanceqty1, clqty);

    // out of stock
    if (clqty === 0) {
      setValue(`itemdtl.${index}.qty1`, 0);
      toast.error("Sale quantity is not allowed because closing quantity is 0.");
      return;
    }

    // adjust if current exceeds max
    if (currentQty > maxQty) {
      setValue(`itemdtl.${index}.qty1`, maxQty);
      toast.error(`Sale quantity adjusted to ${maxQty}`);
    }

  }, [currentProductStock, index, setValue]);

  // Model Search Brand Modal Handlers
  const baseCategoryParams = {
    userid: userId,
    compid: companyId,
    branchid: branchId,
    finid: finid,
    orderid: orderid
  };

  const searchCategoryColumns = [
    { key: "pcategorynm", label: "Brand Name" },
    { key: "productnm", label: "Product Name" },
    { key: "unit", label: "Unit" },
    { key: "qty1", label: "Quantity" },
  ];

  const searchCategoryFields = [
    { value: "name", label: "Name" },
  ];

  const handleCategorySelect = (row: any) => {
    const alreadyExists = watchedItems?.some(
      (item: any) => item?.productid === row.productid
    );

    if (alreadyExists) {
      toast.error("Product already selected");
      return;
    }

    setValue(`itemdtl.${index}.orderdtlid`, row.dtlid);
    setValue(`itemdtl.${index}.pcategorynm`, row.pcategorynm);
    setValue(`itemdtl.${index}.productid`, row.productid);
    setValue(`itemdtl.${index}.productnm`, row.productnm);
    setValue(`itemdtl.${index}.balanceqty1`, row.qty1);
    setValue(`itemdtl.${index}.unit`, row.unit);
    setValue(`itemdtl.${index}.qty1`, 0);

    setCategoryModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700  font-medium mb-1">
          Brand
        </label>

        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => setCategoryModalOpen(true)}
          className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"} `}
          placeholder="Select Brand"
        />
      </div>

      <div className="w-80">
        <label className="block text-gray-700  font-medium mb-1">
          Product
        </label>

        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
          className={`
            inputField w-full 
           
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : " cursor-pointer "}
          `}
          placeholder="Select Product"
        />
        {/*
         ${errors?.itemdtl?.[index]?.productid ? "border-red-500" : "border-gray-300"}
        {errors?.itemdtl?.[index]?.productid && (
          <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].productid.message} </p>
        )} */}
      </div>


      <div className="w-14">
        <label className="block text-gray-700 font-medium mb-1">
          Quantity
        </label>

        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.qty1`, {
            valueAsNumber: true,
            onChange: (e: any) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;

              const balanceqty1 = Number(watchedItems?.[index]?.balanceqty1) || 0;
              const clqty = Number(watchedItems?.[index]?.clqty) || 0;
              const maxQty = Math.min(balanceqty1, clqty) || 0;
              if (value > maxQty) {
                toast.error(`Sale quantity cannot exceed available limit (${maxQty})`);
                value = maxQty;
              }

              setValue(`itemdtl.${index}.qty1`, value);
            },
          })}
          disabled={isReadOnly || Number(watchedItems?.[index]?.clqty) === 0}
          className={`inputField 
            ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-300"} 
            ${isReadOnly || Number(watchedItems?.[index]?.clqty) === 0  ? "bg-gray-100 cursor-not-allowed" : "" }
          `}
          onKeyDown={(e) => { if (e.key === "-") e.preventDefault(); }}
        />
      </div>

      <div className="w-14">
        <label className="block text-gray-700  font-medium mb-1">
          Unit
        </label>
        <input
          {...register(`itemdtl.${index}.unit`)}
          readOnly
          className={`inputField border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1">
          Rate
        </label>

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
      </div>

      <div className="w-24">
        <label className="block text-gray-700  font-medium mb-1">
          Value
        </label>
        <input
          type="number"
          min={0}
          value={Number(value.toFixed(2))}
          readOnly
          className={`inputField  bg-gray-100 border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      </div>
      <div className="w-16">
        <label className="block text-gray-700  font-medium mb-1">
          Order Qty.
        </label>
        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.balanceqty1`)}
          readOnly
          className={` inputField  bg-gray-100 cursor-not-allowed"`}
        />
      </div>

      <div className="w-14">
        <label className="block text-gray-700 font-medium mb-1"> Cl. Stock</label>
        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.clqty`)}
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
              ${fieldsLength === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-red-300 hover:bg-red-600 text-white"}
            `}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <SearchModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        endpoint="so/pendingproductlist"
        baseParams={baseCategoryParams}
        columns={searchCategoryColumns}
        searchFields={searchCategoryFields}
        onSelect={handleCategorySelect}
        excludeIds={excludeIds}
        currentId={currentId}
      />

    </div>

  );


};