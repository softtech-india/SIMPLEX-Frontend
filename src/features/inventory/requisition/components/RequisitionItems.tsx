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
  const qty = Number(item?.qty) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  // Get all selected product IDs except the current one
  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter((id: number) => id && id !== item?.productid);

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
    // Check if product already exists in other rows
    const alreadyExists = watchedItems?.some(
      (item: any, idx: number) => idx !== index && item?.productid === row.id
    );

    if (alreadyExists) {
      // You can show a toast message here
      console.error("Product already selected");
      return;
    }

    setValue(`itemdtl.${index}.productid`, row.id);
    setValue(`itemdtl.${index}.productnm`, row.productname);
    setProductModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Brand
        </label>

        <input
          type="text"
          value={item?.pcategorynm || ""}
          readOnly
          onClick={() => setBrandModalOpen(true)}
          className="inputField w-full cursor-pointer border border-gray-400"
          placeholder="Select Brand"
        />
      </div>

      <div className="w-120">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Product
        </label>

        <input
          type="text"
          value={item?.productnm || ""}
          readOnly
          onClick={() => {
            if (!item?.pcategoryid) return;
            setProductModalOpen(true);
          }}
          className={`inputField w-full cursor-pointer ${errors?.itemdtl?.[index]?.productid
            ? "border-red-500"
            : "border-gray-400"
            }`}
          placeholder="Select Product"
        />
        {errors?.itemdtl?.[index]?.productid && (
          <p className="text-xs text-red-500 mt-1">
            {errors.itemdtl[index].productid.message}
          </p>
        )}
      </div>

      <div className="w-28">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Quantity
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
        excludeIds={selectedProductIds}
        currentId={item?.productid}
      />
    </div>
  );
};