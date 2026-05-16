import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { fetchProductStock } from "@/api/master/product-api";
import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";


type DirectSaleItemsProps = {
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
  billdt: string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
  excludeIds?: number[];
  currentId?: number;
};

export const DirectSaleItems: React.FC<DirectSaleItemsProps> = ({
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
  billdt,
  visible,
  isReadOnly,
  fieldsLength,

  excludeIds,
  currentId

}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

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
  };


  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700 font-medium mb-1"> Brand <strong className="text-red-500"> * </strong> </label>
        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => setBrandModalOpen(true)}
          className="inputField w-full cursor-pointer border border-gray-400"
          placeholder="Select Brand"
        />
      </div>

      <div className="w-80">
        <label className="block text-gray-700 font-medium mb-1"> Product <strong className="text-red-500"> * </strong> </label>
        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
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
        {errors?.itemdtl?.[index]?.productid && !item?.productid && (
          <p className="text-xs text-red-500 mt-1">  {errors.itemdtl[index].productid.message} </p>
        )}
      </div>

      <div className="w-14">
        <label className="block text-gray-700 font-medium mb-1"> Quantity <strong className="text-red-500"> * </strong> </label>
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
          disabled={isReadOnly}
          className={`inputField ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-400"}`}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
        />
        {/* {errors?.itemdtl?.[index]?.qty1 && ( <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].qty1.message}</p> )} */}
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Rate</label>

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

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Value</label>
        <input
          type="number"
          value={Number(value.toFixed(2))}
          readOnly
          className="inputField  bg-gray-100 border-gray-400"
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