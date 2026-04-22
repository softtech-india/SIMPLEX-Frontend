import React from "react";
import { formatINR } from "@/common/utility/FormatedCurrencyInr";
import { Package, Search } from "lucide-react";

export type StatItem = {
  name: string;
  value: number | string;
};

interface CardDetailsTableProps {
  data: StatItem[];
  grandTotal: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  handleSort: (key: keyof StatItem) => void;
  getSortIcon: (key: keyof StatItem) => React.ReactNode;
}

const CardDetailsTableComponent: React.FC<CardDetailsTableProps> = ({
  data,
  grandTotal,
  searchTerm,
  setSearchTerm,
  handleSort,
  getSortIcon,
}) => {

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
        <p className="text-sm text-gray-500 mb-6">
          {searchTerm
            ? "No brands match your search criteria"
            : "There are no records available for the selected period"}
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* <div className="p-2 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div> */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-color text-white text-sm border-b border-gray-100">
              <th
                className="px-2 py-2 text-left font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Brand
              </th>
              <th
                className="px-2 py-2 text-right font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("value")}
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-blue-100/80 transition-colors border-b border-gray-100 group">
                <td className="px-2 py-2 text-sm font-medium text-gray-700">
                  {item.name || "Unnamed Brand"}
                </td>
                <td className="px-2 py-2 text-right text-sm font-semibold text-gray-900">
                  {formatINR(Number(item.value) || 0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-color text-white border-t-2 border-gray-200">
            <tr>
              <td className="px-2 py-2 text-sm font-bold">Grand Total</td>
              <td className="px-2 py-2 text-right text-sm font-bold">  {formatINR(grandTotal)} </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const CardDetailsTable = React.memo(CardDetailsTableComponent);

export default CardDetailsTable;