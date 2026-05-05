import { Trash2 } from "lucide-react";
import { useState } from "react";
import SearchModal from "../../../../common/components/SearchModal";

type RequisitionItemsProps = {
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

export const RequisitionItems: React.FC<RequisitionItemsProps> = ({
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
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Model Search Category Modal Handlers
  const baseCategoryParams = {
    userid: userId,
    compid: companyId,
  };

  const searchCategoryColumns = [
    { key: "name", label: "Category Name" },
  ];

  const searchCategoryFields = [
    { value: "name", label: "Name" },
  ];

  const handleCategorySelect = (row: any) => {
    setValue(`itemdtl.${index}.pcategoryid`, row.id);
    setValue(`itemdtl.${index}.pcategorynm`, row.name);
    setCategoryModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="w-68">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => setCategoryModalOpen(true)}
          className={`inputField w-full cursor-pointer ${errors?.itemdtl?.[index]?.pcategoryid
            ? "border-red-500"
            : "border-gray-400"
            }`}
          placeholder="Select Category"
        />
        {errors?.itemdtl?.[index]?.pcategoryid && (
          <p className="text-xs text-red-500 mt-1">
            {errors.itemdtl[index].pcategoryid.message}
          </p>
        )}
      </div>

      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Quantity <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register(`itemdtl.${index}.qty`)}
          disabled={isReadOnly}
          className={`inputField ${errors?.itemdtl?.[index]?.qty
            ? "border-red-500"
            : "border-gray-400"
            }`}
        />
        {errors?.itemdtl?.[index]?.qty && (
          <p className="text-xs text-red-500 mt-1">
            {errors.itemdtl[index].qty.message}
          </p>
        )}
      </div>

      {/* REMOVE */}
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

      {/* MODAL */}
      <SearchModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        endpoint="category"
        baseParams={baseCategoryParams}
        columns={searchCategoryColumns}
        searchFields={searchCategoryFields}
        onSelect={handleCategorySelect}
      />
    </div>
  );
};