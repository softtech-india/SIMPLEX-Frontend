import React, { useEffect, useMemo } from "react";
import { DeliveryChallanItem } from "../types/deliveryChallan.types";
import { fetchProductStock } from "@/api/master/product-api";
import useUserStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { currentDate } from "@/helpers/dateUtils";

type DeliveryChallanItemsProps = {
  items?: DeliveryChallanItem[];
  register: any;
  errors: any;
  setValue: any;
};

export const DeliveryChallanItems = React.memo(
  ({ items = [], register, errors, setValue }: DeliveryChallanItemsProps) => {
    const { userId, companyId, branchId } = useUserStore();

    const totalQty = useMemo(() => {
      return items.reduce((sum, i) => sum + Number(i.qty ?? 0), 0);
    }, [items]);

    const totalValue = useMemo(() => {
      return items.reduce(
        (sum, i) => sum + Number(i.qty ?? 0) * Number(i.rate ?? 0),
        0
      );
    }, [items]);

    return (
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm border-collapse">

          <thead className="bg-slate-100">
            <tr>
              <th className="border px-2 py-2 w-14">#</th>
              <th className="border px-2 py-2">Brand</th>
              <th className="border px-2 py-2">Product</th>
              <th className="border px-2 py-2 w-28 text-right">Qty</th>
              <th className="border px-2 py-2 w-28 text-right">Rate</th>
              <th className="border px-2 py-2 w-28 text-right">Value</th>
              <th className="border px-2 py-2 w-24">Unit</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-1 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <DeliveryChallanItemRow
                  key={item.dtlid ?? index}
                  item={item}
                  index={index}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  userId={userId}
                  companyId={companyId}
                  branchId={branchId}
                />
              ))
            )}
          </tbody>

          <tfoot>
            <tr className="bg-gray-50 font-semibold">
              <td className="border px-2 py-2 text-right" colSpan={3}> Total Qty </td>

              <td className="border px-2 py-2 text-right">{totalQty}</td>
              <td></td>
              <td className="border px-2 py-2 text-right">  {totalValue.toFixed(2)} </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

DeliveryChallanItems.displayName = "DeliveryChallanItems";

type DeliveryChallanItemRowProps = {
  item: DeliveryChallanItem;
  index: number;
  register: any;
  errors: any;
  setValue: any;
  userId: number | string;
  companyId: number | string;
  branchId: number | string;
};

const DeliveryChallanItemRow: React.FC<DeliveryChallanItemRowProps> = ({
  item,
  index,
  register,
  errors,
  setValue,
  userId,
  companyId,
  branchId,
}) => {
  const selectedProductId = item?.productid;

  const { data: currentProductStock } = useQuery({
    queryKey: ["fetchProductStock", userId, companyId, branchId, selectedProductId, currentDate,],
    queryFn: () => fetchProductStock(userId, companyId, branchId, selectedProductId, currentDate),
    enabled: !!userId && !!companyId && !!branchId && !!selectedProductId && !!currentDate,
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!currentProductStock?.length) return;

    const stockData = currentProductStock[0];
    const clrate = Number(stockData?.clrate || 0);

    const existingRate = Number(item?.rate ?? 0);
    if (!existingRate && clrate) {
      setValue(`itemdtl.${index}.rate`, clrate);
    }
  }, [currentProductStock, index, item?.rate, setValue]);

  return (
    <tr>
      <td className="border p-1 text-center">{item.dtlid ?? index + 1}</td>

      <td className="border p-1">
        <input
          className="inputField w-full bg-gray-50"
          value={item.pcategorynm ?? ""}
          readOnly
        />
      </td>

      <td className="border p-1">
        <input
          className="inputField w-full bg-gray-50"
          value={item.productnm ?? ""}
          readOnly
        />
      </td>

      <td className="border p-1">
        <input
          type="number"
          className="inputField w-full text-right"
          value={item.qty ?? ""}
          readOnly
        />
      </td>

      <td className="border p-1">
        <input
          type="number"
          className="inputField w-full text-right"
          {...register(`itemdtl.${index}.rate`, { valueAsNumber: true })}
        />
        {errors?.itemdtl?.[index]?.rate && (
          <p className="text-xs text-red-500 mt-1">  {errors.itemdtl[index].rate.message} </p>
        )}
      </td>

      <td className="border p-1">
        <input
          type="number"
          className="inputField w-full text-right"
          value={item.qty * (item.rate ?? 0)}
          readOnly
        />
      </td>

      <td className="border p-1">
        <input className="inputField w-full" value={item.unit ?? ""} readOnly />
      </td>
    </tr>
  );
};