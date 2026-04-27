import SearchModal from "@/common/components/SearchModal";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type OpeningStockItemsProps = {
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
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
};

export const OpeningStockItems: React.FC<OpeningStockItemsProps> = ({
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
  visible,
  isReadOnly,
  fieldsLength,
}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [godownModalOpen, setGodownModalOpen] = useState(false);

  // Model Search Godown Modal Handlers
  const baseGodownParams = {
    userid: userId,
    compid: companyId,
    branchid: branchId,
  };

  const searchGodownColumns = [
    { key: "name", label: "Godown Name" },
  ];

  const searchGodownFields = [
    { value: "name", label: "Name" },
    { value: "addr1", label: "Address" },
  ];

  const handleGodownSelect = (row: any) => {
    setValue(`itemdtl.${index}.godownid`, row.id);
    setValue(`itemdtl.${index}.godownnm`, row.name);
    setGodownModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Godown <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          readOnly
          value={item?.godownnm || ""}
          onClick={() => setGodownModalOpen(true)}
          className={`inputField cursor-pointer ${errors?.itemdtl?.[index]?.godownnm ? "border-red-500" : "border-gray-400"}`}
          placeholder="Select Godown"
        />
        {errors?.itemdtl?.[index]?.godownnm && (
          <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].godownnm.message} </p>
        )}
      </div>


      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register(`itemdtl.${index}.qty1`)}
          disabled={isReadOnly}
          className={`inputField ${errors?.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-400"}`}
        />
        {errors?.itemdtl?.[index]?.qty1 && (
          <p className="text-xs text-red-500 mt-1"> {errors.itemdtl[index].qty1.message} </p>
        )}
      </div>

      {/* RATE */}
      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Rate
        </label>
        <input
          type="number"
          {...register(`itemdtl.${index}.rate`)}
          disabled={isReadOnly}
          className="inputField border-gray-400 "
        />
      </div>

      {/* VALUE */}
      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Value
        </label>
        <input
          type="number"
          value={value}
          readOnly
          className="inputField  bg-gray-100 border-gray-400"
        />
      </div>

      {/* REMOVE */}
      {!isReadOnly && (
        <div className="w-12 flex justify-center">
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fieldsLength === 1}
            className={`px-2 py-2 rounded flex items-center justify-center
            ${fieldsLength === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-400 hover:bg-red-600 text-white"}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* MODALS */}
      <SearchModal
        open={godownModalOpen}
        onClose={() => setGodownModalOpen(false)}
        endpoint="godown"
        baseParams={baseGodownParams}
        columns={searchGodownColumns}
        searchFields={searchGodownFields}
        onSelect={handleGodownSelect}
      />

    </div>
  );


};