import React from "react";
import { formatINR } from "@/common/utility/FormatedCurrencyInr";
import { Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";

type BrandItem = {
  brand: string;
  value: number;
  qty: number;
  segment: string;
  segmentid: number;
  brandid: number;
};

type SegmentItem = {
  segment: string;
  total: number;
  totalqty: number;
  brands: BrandItem[];
};

interface CardDetailsTableProps {
  data: SegmentItem[];
  grandTotal: number;
  grandTotalQty: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  // handleSort: (key: keyof SegmentItem) => void;
  getSortIcon: (key: keyof SegmentItem) => React.ReactNode;
}

const PurchaseDetailsTableComponent: React.FC<CardDetailsTableProps> = ({
  data,
  grandTotal,
  grandTotalQty,
  searchTerm,
  setSearchTerm,
  // handleSort,
  getSortIcon,
}) => {

  const router = useRouter();

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

  const handleBrandClick = (brandName: string, segname: string , segmentId: number, brandId: number) => {
    router.push(`/dashboard/brand-details?brand=${encodeURIComponent(brandName)}&type=purchase&seg=${encodeURIComponent(segname)}&segid=${segmentId}&bid=${brandId}`);
  };


  return (
    <div className="bg-white rounded-xl h-screen shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">

      {/*  Search */}
      {/* <div className=" p-1 md:p-2 border-b border-gray-200 bg-gray-100 sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div> */}

      <div className="overflow-auto flex-1">
        <table className="w-full text-sm border-separate border-spacing-y-1">

          <thead className="sticky top-[0px] z-10 bg-color border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 text-left text-sm font-semibold text-white uppercase">Description</th>
              <th className="px-2 py-2 text-right text-sm font-semibold text-white uppercase">Qty</th>
              <th className="px-2 py-2 text-right text-sm font-semibold text-white uppercase">Value</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((segment, sIndex) => (
              <React.Fragment key={sIndex}>

                <tr className="bg-gray-100 border-b border-gray-500">
                  <td className="p-1 md:px-4 md:py-1 font-semibold text-blue-600 text-sm"> {segment.segment} </td>
                  <td className="p-1 md:px-4 md:py-1 font-semibold text-gray-800"></td>
                  <td className="p-1 md:px-4 md:py-1 font-semibold text-gray-800"></td>
                </tr>

                {segment.brands.map((brand, bIndex) => (
                  <tr
                    key={bIndex}
                    className="hover:bg-blue-100/80 transition-colors border-b border-gray-100"
                  >
                    <td
                      className="p-1 md:px-4 md:py-1 text-gray-700 pl-6 md:pl-8 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleBrandClick(brand.brand, brand.segment, brand.segmentid, brand.brandid)}
                    >
                      {brand.brand}
                    </td>
                    <td className="p-1 md:px-4 md:py-1 text-right text-gray-700">
                      {brand.qty}
                    </td>
                    <td className="p-1 md:px-4 md:py-1 text-right text-gray-900">
                      {formatINR(brand.value)}
                    </td>
                  </tr>
                ))}

                <tr className="bg-gray-100 border-t-2 border-blue-200">
                  <td className="p-2 md:px-4 md:py-1 font-semibold text-blue-700">
                    Total {segment.segment}
                  </td>
                  <td className="p-2 md:px-4 md:py-1 text-right font-semibold text-blue-700">
                    {segment.totalqty}
                  </td>
                  <td className="p-2 md:px-4 md:py-1 text-right font-semibold text-blue-700">
                    {formatINR(segment.total)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} className="">
                    <div className="h-0.5"></div>
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t-2 border-gray-300 shadow-md">
        <table className="w-full">
          <tfoot>
            <tr className="bg-color">
              <td className="px-3 py-3 text-sm font-bold text-white"> Grand Total </td>
              <td className="pl-25 py-3 text-right text-sm font-bold text-white"> {grandTotalQty}</td>
              <td className="px-2 py-3 text-right text-sm font-bold text-white"> {formatINR(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );

};

const PurchaseDetailsTable = React.memo(PurchaseDetailsTableComponent);

export default PurchaseDetailsTable;