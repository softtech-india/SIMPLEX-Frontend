"use client"

import { useMemo } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import useIsMobile from "@/common/hooks/useIsMobile";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import useReportStore from "@/store/useReportStore";
import { formatDate } from "@/common/utility/FormatedDate";
import { fetchPurchaseProductDetails } from "@/api/dashboard/CardDetailStat";

import { formatINR } from "@/common/utility/FormatedCurrencyInr";

export default function BrandDetails() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const { type, brand, seg, segid, bid } = router.query;

  const companyId = getStorageItem("companyId");
  const userId = getStorageItem("userId");
  const { dealerledgerCriteria } = useReportStore();

  const decodedBrand = brand ? decodeURIComponent(brand as string) : "";
  const decodedSegment = seg ? decodeURIComponent(seg as string) : "";

  const { data, isLoading, isError, error } = useQuery<any[]>({
    queryKey: ["pruchaserProductDetails", type, companyId, userId, segid, bid, dealerledgerCriteria],
    queryFn: () => {
      const params = {
        userid: userId!,
        compid: companyId!,
        startdt: formatDate(dealerledgerCriteria.startdt),
        enddt: formatDate(dealerledgerCriteria.enddt),
        type,
        segmentid: segid,
        brandid: bid,
      };
      return fetchPurchaseProductDetails(params);
    },
    enabled: !!userId && !!companyId && !!type && !!segid && !!bid,
  });

  // Calculate totals
  const totals = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalQty: 0, totalValue: 0 };
    }

    return data.reduce(
      (acc, item) => ({
        totalQty: acc.totalQty + (Number(item.qty) || 0),
        totalValue: acc.totalValue + (Number(item.value) || 0),
      }),
      { totalQty: 0, totalValue: 0 }
    );
  }, [data]);


  if (!router.isReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">Error loading data</div>
          <p className="text-gray-600">{error?.message || "Something went wrong"}</p>
          <button
            onClick={() => router.reload()}
            className="mt-4 px-4 py-2 bg-color text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div className="mb-1 md:mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-1 md:p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => router.back()}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-sm md:text-lg heading-primary capitalize">
                    {decodedBrand || 'Brand'} - {decodedSegment} Details
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div className="overflow-auto flex-1">
            {data && data.length > 0 ? (
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead className="sticky top-[0px] z-10 bg-color">
                  <tr className="border-b border-gray-300">
                    <th className="px-2 py-2 text-left text-sm font-semibold text-white uppercase border-r border-gray-300">
                      Description
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-semibold text-white uppercase border-r border-gray-300">
                      Class
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold text-white uppercase border-r border-gray-300">
                      Group
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold text-white uppercase border-r border-gray-300">
                      Qty
                    </th>
                    <th className="px-2 py-2 text-right text-sm font-semibold text-white uppercase">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((brand, bIndex) => (
                    <tr
                      key={bIndex}
                      className="hover:bg-blue-100/80 transition-colors border-b border-gray-300"
                    >
                      <td className="p-1 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors border-r border-gray-300">
                        {brand.name}
                      </td>
                      <td className="p-1 text-right text-gray-700 border-r border-gray-300">
                        {brand.pclass}
                      </td>
                      <td className="p-1 text-right text-gray-700 border-r border-gray-300">
                        {brand.pgroup}
                      </td>
                      <td className="p-1 text-right text-gray-700 border-r border-gray-300">
                        {brand.qty}
                      </td>
                      <td className="p-1 text-right text-gray-900">
                        {formatINR(brand.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-color text-white">
                  <tr className="font-semibold">
                    <td colSpan={3} className="px-2 py-2 text-left uppercase text-sm font-semibold border-r border-gray-300">
                      Total
                    </td>
                    <td className="px-2 py-2 text-right font-bold border-r border-gray-300">
                      {totals.totalQty.toLocaleString()}
                    </td>
                    <td className="px-2 py-2 text-right font-bold">
                      {formatINR(totals.totalValue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <div className="h-[85dvh] flex flex-col bg-gray-50 overflow-hidden px-1 py-1">
            <div className="flex-1 overflow-y-auto space-y-2">
              {data && data.length > 0 ? (
                <>
                  {data.map((row, index) => (
                    <div
                      key={index}
                      className="border border-gray-500 rounded-lg bg-white p-1 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-center items-start mb-2">
                        <span className="text-[14px] font-semibold text-color">
                          {row.name || "-"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                          <span className="font-medium text-gray-800"> Quantity: {row.qty || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                          <span className="font-medium text-gray-800"> Value: {formatINR(row.value || 0)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                          <span className="font-medium text-gray-800"> Class: {row.pclass || ''}</span>
                        </div>
                        <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                          <span className="font-medium text-gray-800"> Group: {row.pgroup || ''}</span>
                        </div>
                      </div>

                    </div>
                  ))}

                  <div className="sticky bottom-0 bg-color text-white border-t border-gray-300 px-3 py-2 text-sm text-right">
                    <div className="flex justify-between">
                      <div className="font-bold">
                        Total Quantity : {" "}   {totals?.totalQty?.toLocaleString() || 0}
                      </div>
                      <div className="font-bold">
                        Total Value : {" "}   {formatINR(totals?.totalValue || 0)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}