import { fetchProductList } from "@/api/master/product-api";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

type OptionType = {
  value: number | string;
  label: string;
};

// type ItemType = {
//   brandId?: number; 
//   productid?: number;
//   qty1?: number;
//   rate?: number;
// };

type PurchaseOrderItemsProps = {
  index: number;
  field: { id: string };
  control: any;
  register: any;
  remove: (index: number) => void;
  watchedItems: any;
  userId: number | string;
  companyId: number | string;
  visible: boolean;
  isReadOnly: boolean;
  CategoryOptions: OptionType[];
  fieldsLength: number; 
};

export const PurchaseOrderItems: React.FC<PurchaseOrderItemsProps> = ({
  index,
  field,
  control,
  register,
  remove,
  watchedItems,
  userId,
  companyId,
  visible,
  isReadOnly,
  CategoryOptions,
  fieldsLength,
}) => {
  const item = watchedItems?.[index];

  const qty = Number(item?.qty1) || 0;
  const rate = Number(item?.rate) || 0;
  const value = qty * rate;

  const selectedCategoryId = item?.brandid;

  const { data: ProductOptions = [] } = useQuery({
    queryKey: ["ProductOptions", userId, companyId, selectedCategoryId],
    queryFn: () =>
      fetchProductList(userId, companyId, selectedCategoryId as number),
    enabled:
      !!userId &&
      !!companyId &&
      !!visible &&
      !!selectedCategoryId,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data: any[]) =>
      (data ?? []).map((s) => ({
        value: s.id,
        label: s.productname,
      })),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
      {/* Brand */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Brand</label>
        <FormSelect
          name={`itemdtl.${index}.brandid`}
          control={control}
          options={CategoryOptions}
        />
      </div>

      {/* Product */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Product</label>
        <FormSelect
          name={`itemdtl.${index}.productid`}
          control={control}
          options={ProductOptions}
        />
      </div>

      {/* Qty */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Quantity</label>
        <input
          type="number"
          {...register(`itemdtl.${index}.qty1`)}
          disabled={isReadOnly}
          className="inputField"
        />
      </div>

      {/* Rate */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Rate</label>
        <input
          type="number"
          {...register(`itemdtl.${index}.rate`)}
          disabled={isReadOnly}
          className="inputField"
        />
      </div>

      {/* Value */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Value</label>
        <input
          type="number"
          value={value}
          readOnly
          className="inputField bg-gray-100"
        />
      </div>

      {/* Remove */}
      {!isReadOnly && (
        <button
          type="button"
          onClick={() => remove(index)}
          disabled={fieldsLength === 1}
          className={`w-12 px-3 py-1 rounded text-xs flex items-center justify-center gap-1
            ${fieldsLength === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
            }`}
        >
          <Trash2 size={16}/>
        </button>
      )}
    </div>
  );
};