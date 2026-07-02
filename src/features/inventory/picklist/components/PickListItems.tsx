import React, { useMemo } from "react";
import {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import {
  PickListItem,
} from "../types/pickList.types";

type PickListItemsProps = {
  items?: PickListItem[];
  register: any;
  errors: any;
};

export const PickListItems = React.memo( ({ items = [], register }: PickListItemsProps) => {


  const totalQty = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + Number(i.qty ?? 0),
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
            <th className="border px-2 py-2 w-28 text-right">  Qty </th>
            <th className="border px-2 py-2 w-24">Unit</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border p-1 text-center text-gray-500"
              >
                No items found
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.dtlid ?? index}>
                <td className="border p-1 text-center">
                  {index + 1}
                </td>

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
                    {...register(`itemdtl.${index}.qty`, {
                      valueAsNumber: true,
                    })}
                  />
                </td>

                <td className="border p-1">
                  <input
                    className="inputField w-full"
                    {...register(`itemdtl.${index}.unit`)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>

        {/* FOOTER */}
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

            <td className="border px-2 py-2"></td>
          </tr>
        </tfoot>

      </table>
    </div>
  );
}
);