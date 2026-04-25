// OpeningStockItems.tsx
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { OpeningStockFormSchema } from "../schemas/openingStock.schema";
import { FormSelect } from "@/common/components/FormSelect";

interface OpeningStockItemsProps {
  index: number;
  field: any;
  control: Control<OpeningStockFormSchema>;
  setValue: UseFormSetValue<OpeningStockFormSchema>;
  register: UseFormRegister<OpeningStockFormSchema>;
  errors: FieldErrors<OpeningStockFormSchema>;
  remove: (index: number) => void;
  watchedItems: any[];
  isReadOnly: boolean;
  fieldsLength: number;
  godownOptions: { label: string; value: number }[];
}

export function OpeningStockItems({
  index,
  control,
  register,
  errors,
  remove,
  isReadOnly,
  fieldsLength,
  godownOptions,
}: OpeningStockItemsProps) {
  const qty1 = register(`itemdtl.${index}.qty1`, { valueAsNumber: true });
  const rate = register(`itemdtl.${index}.rate`, { valueAsNumber: true });

  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-24">
          <label className="block text-gray-700 text-sm font-medium mb-1">Tag</label>
          <input
            type="text"
            {...register(`itemdtl.${index}.tag`)}
            disabled={isReadOnly}
            className="inputField border-gray-400"
            placeholder="Tag"
          />
        </div>

        <div className="w-24">
          <label className="block text-gray-700 text-sm font-medium mb-1">DTL ID</label>
          <input
            type="number"
            {...register(`itemdtl.${index}.dtlid`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="inputField border-gray-400"
          />
        </div>

        <div className="w-48">
          <label className="block text-gray-700 text-sm font-medium mb-1">Godown</label>
          <FormSelect
            name={`itemdtl.${index}.godownid`}
            control={control}
            options={godownOptions}
            isDisabled={isReadOnly}
          />
          {errors.itemdtl?.[index]?.godownid && (
            <p className="text-red-500 text-xs mt-1">Godown is required</p>
          )}
        </div>

        <div className="w-32">
          <label className="block text-gray-700 text-sm font-medium mb-1">Quantity 1</label>
          <input
            type="number"
            step="any"
            {...qty1}
            disabled={isReadOnly}
            className={`inputField ${errors.itemdtl?.[index]?.qty1 ? "border-red-500" : "border-gray-400"}`}
          />
        </div>

        <div className="w-32">
          <label className="block text-gray-700 text-sm font-medium mb-1">Quantity 2</label>
          <input
            type="number"
            step="any"
            {...register(`itemdtl.${index}.qty2`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="inputField border-gray-400"
          />
        </div>

        <div className="w-32">
          <label className="block text-gray-700 text-sm font-medium mb-1">Rate</label>
          <input
            type="number"
            step="any"
            {...rate}
            disabled={isReadOnly}
            className={`inputField ${errors.itemdtl?.[index]?.rate ? "border-red-500" : "border-gray-400"}`}
          />
        </div>

        <div className="w-32">
          <label className="block text-gray-700 text-sm font-medium mb-1">Value</label>
          <input
            type="number"
            step="any"
            {...register(`itemdtl.${index}.value`, { valueAsNumber: true })}
            disabled={isReadOnly}
            className="inputField bg-gray-100 border-gray-400"
          />
        </div>

        {!isReadOnly && fieldsLength > 1 && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-2 rounded border border-red-300 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}