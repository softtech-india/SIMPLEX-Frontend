import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SearchModal from "@/common/components/SearchModal";

type GodownTransferItemsProps = {
  index: number;
  reqid: number;
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
  finid?: number | string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
  excludeIds?: number[];
  currentId?: number;
};

export const GodownTransferItems: React.FC<GodownTransferItemsProps> = ({
  index,
  field,
  reqid,
  control,
  register,
  errors,
  setValue,
  remove,
  watchedItems,
  userId,
  companyId,
  branchId,
  finid,
  visible,
  isReadOnly,
  fieldsLength,
  excludeIds,
  currentId,
}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [productModalOpen, setProductModalOpen] = useState(false);

  const baseProductParams = {
    userid: userId,
    compid: companyId,
    branchid: branchId,
    finid: finid,
    reqid: reqid
  };

  const searchProductColumns = [
    { key: "pcategorynm", label: "Category" },
    { key: "productnm", label: "Product" },
    { key: "qty", label: "Qty" },
    { key: "unit", label: "Unit" },
  ];

  const searchProductFields = [
    { value: "productnm", label: "Product Name" },
    { value: "pcategorynm", label: "Category" },
  ];

  const handleProductSelect = (row: any) => {
    // Check if product already exists in other rows
    const alreadyExists = watchedItems?.some(
      (item: any, idx: number) =>
        idx !== index && item?.productid === row.productid
    );

    if (alreadyExists) {
      toast.error("Product already selected");
      return;
    }

    // Set all fields from the selected requisition product
    setValue(`itemdtl.${index}.dtlid`, row.dtlid);
    setValue(`itemdtl.${index}.pcategoryid`, row.pcategoryid);
    setValue(`itemdtl.${index}.pcategorynm`, row.pcategorynm);
    setValue(`itemdtl.${index}.productid`, row.productid);
    setValue(`itemdtl.${index}.productnm`, row.productnm);
    setValue(`itemdtl.${index}.balanceqty`, row.qty); // Store balance quantity
    setValue(`itemdtl.${index}.qty`, 0); // Start with 0
    setValue(`itemdtl.${index}.rate`, row.rate || 0);
    setValue(`itemdtl.${index}.value`, 0);
    setValue(`itemdtl.${index}.reqdtlid`, row.dtlid);
    setValue(`itemdtl.${index}.unit`, row.unit || "");

    setProductModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="w-60">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Category
        </label>
        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => {
            if (!isReadOnly && reqid && reqid !== 0) {
              setProductModalOpen(true);
            } else if (!isReadOnly && (!reqid || reqid === 0)) {
              toast.error("Please select a Requisition first");
            }
          }}
          className={`inputField w-full border border-gray-300
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          placeholder="Select Product"
        />
      </div>

      <div className="w-72">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Product
        </label>
        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
          onClick={() => {
            if (!isReadOnly && reqid && reqid !== 0) {
              setProductModalOpen(true);
            } else if (!isReadOnly && (!reqid || reqid === 0)) {
              toast.error("Please select a Requisition first");
            }
          }}
          className={`inputField w-full border
            ${errors?.itemdtl?.[index]?.productid ? "border-red-500" : "border-gray-300"}
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
          placeholder="Select Product"
        />
        {errors?.itemdtl?.[index]?.productid && (
          <p className="text-xs text-red-500 mt-1">
            {errors.itemdtl[index].productid.message}
          </p>
        )}
      </div>

      <div className="w-24">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Quantity
        </label>
        <input
          type="number"
          min={0}
          step="any"
          {...register(`itemdtl.${index}.qty`, {
            valueAsNumber: true,
            onChange: (e: any) => {
              let newQty = Number(e.target.value) || 0;
              if (newQty < 0) newQty = 0;

              // Get balance quantity from the item
              const balanceQty = Number(watchedItems?.[index]?.balanceqty) || 0;

              // Check if quantity exceeds balance
              if (newQty > balanceQty) {
                toast.error(`Quantity cannot exceed balance quantity (${balanceQty})`);
                newQty = balanceQty;
              }

              const currentRate = Number(watchedItems?.[index]?.rate) || 0;
              const newValue = newQty * currentRate;
              setValue(`itemdtl.${index}.qty`, newQty);
              setValue(`itemdtl.${index}.value`, newValue);
            },
          })}
          disabled={isReadOnly}
          className={`inputField
            ${errors?.itemdtl?.[index]?.qty ? "border-red-500" : "border-gray-300"}
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
        />
      </div>

      <div className="w-14">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Unit
        </label>
        <input
          value={item?.unit || ""}
          readOnly
          className={`inputField border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      </div>

      <div className="w-24">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Rate
        </label>
        <input
          type="number"
          min={0}
          step="any"
          {...register(`itemdtl.${index}.rate`, {
            valueAsNumber: true,
            onChange: (e: any) => {
              let newRate = Number(e.target.value) || 0;
              if (newRate < 0) newRate = 0;
              const currentQty = Number(watchedItems?.[index]?.qty) || 0;
              const newValue = currentQty * newRate;
              setValue(`itemdtl.${index}.rate`, newRate);
              setValue(`itemdtl.${index}.value`, newValue);
            },
          })}
          disabled={isReadOnly}
          className={`inputField border-gray-300
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
        />
      </div>

      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Value
        </label>
        <input
          type="number"
          min={0}
          value={value.toFixed(2)}
          readOnly
          className="inputField bg-gray-100 border-gray-300"
        />
      </div>

      <div className="w-14">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Bal. Qty
        </label>
        <input
          type="number"
          value={item?.balanceqty || 0}
          readOnly
          className="inputField bg-gray-100 cursor-not-allowed"
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
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-300 hover:bg-red-600 text-white"}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <SearchModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        endpoint="requisition/pendingproductlist"
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