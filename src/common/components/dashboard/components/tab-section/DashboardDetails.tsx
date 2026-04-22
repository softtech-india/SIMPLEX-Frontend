"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import notify from "devextreme/ui/notify";

import { fetchDashboardDetails, fetchPurchaseDetails } from "@/api/dashboard/CardDetailStat";
import { formatDate } from "@/common/utility/FormatedDate";
import { formatINR } from "@/common/utility/FormatedCurrencyInr";
import { getStorageItem } from "@/common/utility/storage";
import useReportStore from "@/store/useReportStore";
import useDebounce from "@/common/hooks/useDebounce";

import DetailsSkeleton from "./card-details/DetailsSkeleton";
import {
  ArrowLeft,
  Package,
  BarChart3,
  IndianRupee,
  MoveUp,
  MoveDown,
} from "lucide-react";
import SummaryCard from "./card-details/SummaryCard";
import CardDetailsTable from "./card-details/CardDetailsTable";
import useIsMobile from "@/common/hooks/useIsMobile";
import PurchaseDetailsTable from "./card-details/PurchaseDetailsTable";

type StatItem = {
  name: string;
  value: number | string;
};

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

export default function DashboardDetailsPage() {

  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "default";

  const companyId = getStorageItem("companyId");
  const userId = getStorageItem("userId");
  const { dealerledgerCriteria } = useReportStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StatItem;
    direction: "asc" | "desc";
  }>({ key: "value", direction: "desc" });

  const { data, isLoading, isError, error } = useQuery<any[]>({
    queryKey: ["dashboardDetails", type, companyId, userId, dealerledgerCriteria],
    queryFn: () => {
      const params = {
        userid: userId!,
        compid: companyId!,
        startdt: formatDate(dealerledgerCriteria.startdt),
        enddt: formatDate(dealerledgerCriteria.enddt),
        type,
      };

      return type === "purchase"
        ? fetchPurchaseDetails(params)   // ✅ separate API
        : fetchDashboardDetails(params); // ✅ existing API
    },
    enabled: !!userId && !!companyId && !!type,
    staleTime: 1000 * 60 * 5,
  });

  const statData: StatItem[] = type === "purchase" ? [] : (data as StatItem[]) ?? [];

  const segmentData: SegmentItem[] =
    type === "purchase" ? (data as SegmentItem[]) ?? [] : [];

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedData = useMemo(() => {
    if (type === "purchase") {
      let filtered = [...segmentData];

      if (debouncedSearchTerm) {
        filtered = filtered
          .map(segment => ({
            ...segment,
            brands: segment.brands.filter(b =>
              b.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
          }))
          .filter(segment => segment.brands.length > 0);
      }

      // sort by segment total
      // filtered.sort((a, b) => {
      //   return sortConfig.direction === "asc"
      //     ? a.total - b.total
      //     : b.total - a.total;
      // });

      return filtered;
    }

    // NORMAL (existing logic)
    let filtered = [...statData];

    if (debouncedSearchTerm) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const key = sortConfig.key;
      let aValue = a[key];
      let bValue = b[key];

      if (key === "value") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [type, statData, segmentData, debouncedSearchTerm, sortConfig]);

  const { grandTotal, grandTotalQty } = useMemo(() => {
    if (type === "purchase") {
      return {
        grandTotal: segmentData.reduce(
          (sum, seg) => sum + Number(seg.total || 0),
          0
        ),
        grandTotalQty: segmentData.reduce(
          (sum, seg) => sum + Number(seg.totalqty || 0),
          0
        ),
      };
    }

    return {
      grandTotal: statData.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
      ),
      grandTotalQty: 0,
    };
  }, [type, statData, segmentData]);

  type SortKey = "name" | "value" | "segment" | "total";
  const handleSort = useCallback((key: keyof StatItem) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const getSortIcon = useCallback((key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <MoveUp size={14} /> : <MoveDown size={14} />;
  }, [sortConfig]);

  if (isLoading) return <DetailsSkeleton />;

  if (isError) {
    notify((error as Error)?.message || "Failed to fetch data", "error", 3000);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load data. Please try again.</p>
      </div>
    );
  }

  const typeLabelMap = {
    balancelimit: "Balance Limit",
    incentiveavailed: "Incentive Avail",
    pendingorders: "Pending Orders",
  } as const;

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-1">

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
                  <h1 className="sm:text-lg md:text-xl heading-primary capitalize">
                    {typeLabelMap[type as keyof typeof typeLabelMap] ?? type} Details
                  </h1>

                  {/* {!isMobile && (
                    <>
                      <p className="text-xs text-gray-500">
                        {type === "purchase"
                          ? `Detailed breakdown by segment & brand • Last updated: ${new Date().toLocaleDateString()}`
                          : `Detailed breakdown by brand • Last updated: ${new Date().toLocaleDateString()}`
                        }
                      </p>
                    </>
                  )} */}

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* type !== "purchase" && */}

        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <SummaryCard
              title={type === "purchase" ? "Total Segment" : "Total Brands"}
              icon={<Package className="w-4 h-4 text-gray-400" />}
              value={type === "purchase" ? segmentData.length : statData.length}
            />
            <SummaryCard
              title="Grand Total"
              icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
              value={formatINR(grandTotal)}
            />
            <SummaryCard
              title={type === "purchase" ? "Average per Segment" : "Average per Brands"}
              icon={<BarChart3 className="w-4 h-4 text-gray-400" />}
              value={type === "purchase" ? formatINR(segmentData.length ? grandTotal / segmentData.length : 0) : formatINR(statData.length ? grandTotal / statData.length : 0)}
            />
          </div>
        )}

        {isMobile && (
          <div className="flex gap-4 overflow-x-auto mb-2">
            <SummaryCard
              title="Total "
              icon={<Package className="w-4 h-4 text-gray-400" />}
              value={type === "purchase" ? segmentData.length : statData.length}
            />
            <SummaryCard
              title="Grand "
              icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
              value={formatINR(grandTotal)}
            />
            <SummaryCard
              title="Average "
              icon={<BarChart3 className="w-4 h-4 text-gray-400" />}
              value={type === "purchase" ? formatINR(segmentData.length ? grandTotal / segmentData.length : 0) : formatINR(statData.length ? grandTotal / statData.length : 0)}
            />
          </div>
        )}

        {type === "purchase" ? (
          <PurchaseDetailsTable
            data={filteredAndSortedData as SegmentItem[]}
            grandTotal={grandTotal}
            grandTotalQty={grandTotalQty}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            // handleSort={handleSort}
            getSortIcon={getSortIcon}
          />
        ) : (
          <CardDetailsTable
            data={filteredAndSortedData as StatItem[]}
            grandTotal={grandTotal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
          />
        )}

        {/* {!isMobile && (
          <>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing{" "}
                {type === "purchase"
                  ? (filteredAndSortedData as SegmentItem[]).length
                  : filteredAndSortedData.length}{" "}
                of{" "}
                {type === "purchase"
                  ? segmentData.length
                  : statData.length}{" "}
                entries
              </span>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </>
        )} */}

      </div>
    </div>
  );
}