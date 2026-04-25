import { Trash2 } from "lucide-react";
import { useState } from "react";
import SearchModal from "@/common/components/SearchModal";


type GoodReceivedNoteItemsProps = {
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
  finid: number | string;
  orderid: number | string;
  visible: boolean;
  isReadOnly: boolean;
  fieldsLength: number;
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
  userId,
  companyId,
  branchId,
  finid,
  orderid,
  visible,
  isReadOnly,
  fieldsLength,
}) => {
  const item = watchedItems?.[index];
  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;


  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

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

  // const searchCategoryColumns = [
  //   { key: "pcategorynm", label: "Category Name" },
  //   { key: "productnm", label: "Product Name" },
  //   { key: "unit", label: "Unit" },
  //   { key: "qty1", label: "Quantity" },
  // ];

  const searchCategoryFields = [
    { value: "name", label: "Name" },
  ];

  const handleCategorySelect = (row: any) => {
    console.log('row :', row);
    setValue(`itemdtl.${index}.pcategoryid`, row.id);
    setValue(`itemdtl.${index}.pcategorynm`, row.pcategorynm);
    setValue(`itemdtl.${index}.productid`, null);
    setValue(`itemdtl.${index}.productnm`, "");
    setCategoryModalOpen(false);
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
    setValue(`itemdtl.${index}.productid`, row.id);
    setValue(`itemdtl.${index}.productnm`, row.productname);
    setProductModalOpen(false);
  };


  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="w-68">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Category
        </label>

        <input
          type="text"
          readOnly
          value={item?.pcategorynm || ""}
          onClick={() => setCategoryModalOpen(true)}
          className="inputField w-full cursor-pointer border border-gray-400"
          placeholder="Select Category"
        />
      </div>

      {/* <div className="w-120">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Product
        </label>

        <input
          type="text"
          readOnly
          value={item?.productnm || ""}
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
      </div> */}

      <div className="w-120">
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Product
        </label>

        <input
          type="text"
          readOnly
          value={item?.productnm || ""}
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
          {...register(`itemdtl.${index}.qty1`)}
          disabled={isReadOnly}
          className={`inputField ${errors?.itemdtl?.[index]?.qty1
            ? "border-red-500"
            : "border-gray-400"
            }`}
        />
        {errors?.itemdtl?.[index]?.qty1 && (
          <p className="text-xs text-red-500 mt-1">
            {errors.itemdtl[index].qty1.message}
          </p>
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
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        endpoint="po/pendingproductlist"
        baseParams={baseCategoryParams}
        columns={searchCategoryColumns}
        searchFields={searchCategoryFields}
        onSelect={handleCategorySelect}
      />

      {/* <SearchModal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        endpoint="product"
        baseParams={baseProductParams}
        columns={searchProductColumns}
        searchFields={searchProductFields}
        onSelect={handleProductSelect}
      /> */}


    </div>

  );


};