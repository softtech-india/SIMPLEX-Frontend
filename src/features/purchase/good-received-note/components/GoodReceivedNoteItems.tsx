import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { OperationMode } from "../types/goodReceivedNote.types";


type GoodReceivedNoteItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  errors: any;
  setValue: any;
  remove: (index: number) => void;
  watchedItems: any;
  isRowConfirmed: boolean;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
  finid: number | string;
  orderid: number | string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;

  mode: OperationMode;

  excludeIds?: number[];
  currentId?: number;
};

export const GoodReceivedNoteItems: React.FC<GoodReceivedNoteItemsProps> = ({
  index,
  field,
  control,
  register,
  errors,
  setValue,
  remove,
  watchedItems,
  isRowConfirmed,
  userId,
  companyId,
  branchId,
  finid,
  orderid,
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

  const actualValue =
    mode === 'Confirmed' ? Number(item.scanqty) * rate : 0;



  // useEffect(() => {
  //   console.log('isRowConfirmed :', isRowConfirmed);
  // }, [isRowConfirmed])


  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Model Search Category Modal Handlers
  const baseCategoryParams = {
    userid: userId,
    compid: companyId,
    branchid: branchId,
    finid: finid,
    orderid: orderid
  };

  const searchCategoryColumns = [
    { key: "pcategorynm", label: "Category Name" },
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
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Category
        </label>

        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => setCategoryModalOpen(true)}
          className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"} `}
          placeholder="Select Category"
        />
      </div>

      <div className="w-80">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Product
        </label>

        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
          className={`
            inputField w-full 
            ${errors?.itemdtl?.[index]?.productid ? "border-red-500" : "border-gray-300"}
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : " cursor-pointer "}
          `}
          placeholder="Select Product"
        />
        {errors?.itemdtl?.[index]?.productid && (
          <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].productid.message} </p>
        )}
      </div>

      <div className="w-20">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Quantity
        </label>
        <input
          type="number"
          min={0}
          {...register(`itemdtl.${index}.qty1`, {
            valueAsNumber: true,
            onChange: (e: any) => {
              let value = Number(e.target.value);

              if (value < 0) value = 0;

              const balanceqty1 = Number(watchedItems?.[index]?.balanceqty1) || 0;

              if (value > balanceqty1) {
                toast.error("Quantity cannot exceed balance");
                value = balanceqty1;
              }

              setValue(`itemdtl.${index}.qty1`, value);
            },
          })}
          disabled={isReadOnly}
          className={`
            inputField 
            ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-300"} 
            ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
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
          {...register(`itemdtl.${index}.unit`)}
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
          {...register(`itemdtl.${index}.rate`)}
          disabled={isReadOnly}
          className={`inputField border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""} `}
          onKeyDown={(e) => {
            if (e.key === "-") e.preventDefault();
          }}
        />
      </div>

      <div className="w-24">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Value
        </label>
        <input
          type="number"
          min={0}
          value={value}
          readOnly
          className={`inputField  bg-gray-100 border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      </div>

      {(mode !== 'Confirmed') && (
        <>
          <div className="w-14">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Bal. Qty.
            </label>
            <input
              type="number"
              min={0}
              {...register(`itemdtl.${index}.balanceqty1`)}
              readOnly
              className={`
                inputField  bg-gray-100 cursor-not-allowed"
                ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-300"}
              `}
            />
          </div>
        </>
      )}

      {isRowConfirmed && (
        <div className="w-24">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Confirm Qty.
          </label>
          <input
            type="number"
            min={0}
            {...register(`itemdtl.${index}.confirmqty1`)}
            disabled={isReadOnly}
            className={`
                inputField 
                ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-300"}
                ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}
              `}
          />
        </div>
      )}

      {(mode === 'Confirmed') && (
        <>
          <div className="w-14">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Scan
            </label>
            <input
              type="number"
              min={0}
              disabled={isReadOnly}
              {...register(`itemdtl.${index}.scanqty`)}
              className={`inputField border-gray-300 `}
              onKeyDown={(e) => {
                if (e.key === "-") e.preventDefault();
              }}
            />
          </div>
          <div className="w-14">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Short
            </label>
            <input
              type="number"
              min={0}
              disabled={isReadOnly}
              {...register(`itemdtl.${index}.shortqty`)}
              className={`inputField border-gray-300 `}
              onKeyDown={(e) => {
                if (e.key === "-") e.preventDefault();
              }}
            />
          </div>
          <div className="w-14">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Excess
            </label>
            <input
              type="number"
              min={0}
              disabled={isReadOnly}
              {...register(`itemdtl.${index}.excessqty`)}
              className={`inputField border-gray-300 `}
              onKeyDown={(e) => {
                if (e.key === "-") e.preventDefault();
              }}
            />
          </div>

          <div className="w-20">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Actual Value
            </label>
            <input
              type="number"
              min={0}
              value={actualValue}
              readOnly
              className={`inputField  bg-gray-100 border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
        </>
      )}

      {!isReadOnly && (
        <div className="w-12 flex justify-center">
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fieldsLength === 1}
            className={`px-2 py-2 rounded flex items-center justify-center
            ${fieldsLength === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-300 hover:bg-red-600 text-white"
              }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <SearchModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        endpoint="po/pendingproductlist"
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