import React, { useMemo } from "react";
import { DeliveryChallanItem } from "../types/deliveryChallan.types";

type DeliveryChallanItemsProps = {
  items?: DeliveryChallanItem[];
  register: any;
  errors: any;
};

export const DeliveryChallanItems = React.memo(({ items = [], register }: DeliveryChallanItemsProps) => {

  const totalQty = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + Number(i.qty ?? 0),
      0
    );
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

        {/* HEADER */}
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

        {/* BODY */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="border p-1 text-center text-gray-500" >  No items found </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.dtlid ?? index}>
                <td className="border p-1 text-center"> {item.dtlid ?? index + 1}  </td>

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
                    // value={item.rate ?? ""}
                    {...register(`itemdtl.${index}.rate`, { valueAsNumber: true, })}
                  // readOnly
                  />
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
                  <input
                    className="inputField w-full"
                    value={item.unit ?? ""}
                    readOnly
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>

        <tfoot>
          <tr className="bg-gray-50 font-semibold">
            <td
              className="border px-2 py-2 text-right"
              colSpan={3}
            >
              Total Qty
            </td>

            <td className="border px-2 py-2 text-right">
              {totalQty}
            </td>
            <td></td>
            <td className="border px-2 py-2 text-right">
              {totalValue.toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>

      </table>
    </div>
  );
}
);