import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchProductStock } from "@/api/master/product-api";
import { Controller } from "react-hook-form";


type SaleOrderItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  errors: any;
  setValue: any;
  remove: (index: number) => void;
  watchedItems: any;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
  orderDate: string;
  GodownId: number | string;
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
  remove,
  watchedItems,
  userId,
  companyId,
  branchId,
  orderDate,
  GodownId,
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

  const selectedProductId = item?.productid;

  const { data: currentProductStock } = useQuery({
    queryKey: [
      "fetchProductStock",
      userId,
      companyId,
      branchId,
      selectedProductId,
      orderDate,
      GodownId,
    ],
    queryFn: () => fetchProductStock(userId, companyId, branchId, selectedProductId, orderDate, GodownId),
    enabled:
      !!userId &&
      !!companyId &&
      !!branchId &&
      !!selectedProductId &&
      !!GodownId &&
      !!orderDate,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!currentProductStock?.length) return;

    const stockData = currentProductStock[0];
    const clqty = Number(stockData?.clqty || 0);

    setValue(`itemdtl.${index}.clqty`, clqty);

    const currentQty = Number(item?.qty1 || 1);

    // out of stock
    if (clqty === 0) {
      setValue(`itemdtl.${index}.qty1`, 0);
      toast.error("Sale quantity is not allowed because closing quantity is 0.");
      return;
    }

    // adjust if current exceeds max
    if (currentQty > clqty) {
      setValue(`itemdtl.${index}.qty1`, clqty);
      toast.error(`Sale quantity adjusted to ${clqty}`);
    }

  }, [currentProductStock, item?.qty1, index, setValue]);

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
      (item: any, i: number) =>
        i !== index && item?.productid === row.id
    );

    if (alreadyExists) {
      toast.error("Brand already selected");
      return;
    }

    setValue(`itemdtl.${index}.productid`, row.id);
    setValue(`itemdtl.${index}.productnm`, row.productname);
    setProductModalOpen(false);
  };


  return (
    <div className="flex flex-wrap gap-1 items-end">

      <div className="w-68">
        <label className="block text-gray-700 font-medium mb-1"> Brand <strong className="text-red-500"> * </strong> </label>
        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          ref={brandInputRef}

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
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Quantity <strong className="text-red-500"> * </strong> </label>
        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.qty1`, {
            valueAsNumber: true,
            validate: (value: any) => {
              const clqty = Number(item?.clqty || 0);
              if (value > clqty) {
                return `Issued quantity (Qty1) cannot be greater than the available closing stock (${clqty}).`;
              }
              return true;
            },
            onChange: (e: any) => {
              let value = Number(e.target.value);
              const clqty = Number(item?.clqty || 0);
              if (value < 1) value = 1;

              if (value > clqty) {
                toast.error(
                  `Issued quantity (Qty1) cannot be greater than available stock (${clqty}).`
                );
                value = clqty;
              }
              setValue(`itemdtl.${index}.qty1`, value, { shouldValidate: true });
            },
          })}
          disabled={isReadOnly || Number(item?.clqty) === 0}
          className={`inputField
              ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-300"}
              ${isReadOnly || Number(item?.clqty) === 0 ? "bg-gray-200 cursor-not-allowed" : ""}
            `}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
        />
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
      </div>

      <div className="w-28">
        <label className="block text-gray-700 font-medium mb-1"> Value</label>
        <input
          type="number"
          value={value}
          readOnly
          className="inputField  bg-gray-100 border-gray-400"
        />
      </div>

      <td className="w-20">
        <label className="block text-gray-700 font-medium mb-1"> Cl. Stock</label>
        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.clqty`)}
          readOnly
          tabIndex={-1}
          className="inputField bg-gray-100 border-gray-400"
        />
      </td>

      {!isReadOnly && (
        <div className="w-12 flex justify-center">
          <button
            type="button"
            onClick={() => remove(index)}
            // disabled={fieldsLength === 1}
            className={`px-2 py-2 rounded flex items-center justify-center bg-red-400 hover:bg-red-600 text-white`}
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