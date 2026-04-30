'use client';

import { useState, useCallback, useEffect } from 'react';
import { StockTrialDataGrid } from './components/StockTrialDataGrid';
import { useStockTrialList } from './hooks/useStockTrial';
import { StockTrial } from './types/stockTrial.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from './components/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate, formatDate } from '@/helpers/dateUtils';
import StockTrialFilterCriteria from './components/StockTrialFilterCriteria';
import {
  StockTrialFilterState,
  DEFAULT_STOCK_TRIAL_FILTER,
  formatDateForApi
} from './types/stockTrial.types';

export default function StockTrialModule() {
  // Hooks
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setSelectedRow] = useState<StockTrial | null>(null);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);

  // ✅ Direct date state like Purchase Order
  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  // Centralized filter state for advanced filters (not dates)
  const [filterParams, setFilterParams] = useState<StockTrialFilterState>({
    ...DEFAULT_STOCK_TRIAL_FILTER,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: Number(branchId),
    finid: Number(finid),
    startdt: formatDateForApi(currentDate),
    enddt: formatDateForApi(currentDate),
    strbrand: '',
    strclass: '',
    strsubclass: '',
    strgodown: '',
  });

  // ✅ API call with both date and advanced filters
  const { data: stockTrialList = [], isLoading, refetch } = useStockTrialList({
    userid: filterParams.userid,
    compid: filterParams.compid,
    branchid: filterParams.branchid,
    finid: filterParams.finid,
    startdt: fromDate ? formatDateForApi(fromDate) : formatDateForApi(currentDate), // ✅ Use fromDate directly
    enddt: toDate ? formatDateForApi(toDate) : formatDateForApi(currentDate), // ✅ Use toDate directly
    printrtval: filterParams.printrtval,
    strbrand: filterParams.strbrand,
    strclass: filterParams.strclass,
    strsubclass: filterParams.strsubclass,
    balancetag: filterParams.balancetag,
    strgodown: filterParams.strgodown,
  });

  const { data: BranchOrderOptions = [] } = useQuery({
    queryKey: ["BranchOrderOptions", userId, companyId],
    queryFn: () => fetchBranchList(userId, companyId),
    staleTime: 0,
    enabled: !!companyId && !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
  });

  // ✅ Refetch when dates or advanced filters change
  useEffect(() => {
    refetch();
  }, [fromDate, toDate, filterParams, refetch]);

  // Handlers
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      setSelectedRow(e.selectedRowsData[0]);
    } else {
      setSelectedRow(null);
    }
  }, []);

  const handleMoreFilterClick = useCallback(() => {
    setIsFilterFormOpen(true);
  }, []);

  const handleFilterFormClose = useCallback(() => {
    setIsFilterFormOpen(false);
  }, []);

  const handleApplyFilters = useCallback((filters: Partial<StockTrialFilterState>) => {
    setFilterParams(prev => ({
      ...prev,
      ...filters,
    }));
    setIsFilterFormOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterParams({
      ...DEFAULT_STOCK_TRIAL_FILTER,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: Number(branchId),
      finid: Number(finid),
      startdt: formatDateForApi(currentDate),
      enddt: formatDateForApi(currentDate),
      strbrand: '',
      strclass: '',
      strsubclass: '',
      strgodown: '',
      printrtval: 0
    });
    // ✅ Also reset dates
    setFromDate(currentDate);
    setToDate(currentDate);
  }, [userId, companyId, branchId, finid]);

  const handleRefresh = useCallback(() => {
    handleClearFilters();
  }, [handleClearFilters]);

  const handleExport = useCallback(() => {
    if (!stockTrialList || stockTrialList.length === 0) return;

    const columns: ExcelColumn[] = Object.keys(stockTrialList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: stockTrialList,
      columns,
      fileName: "Stock Trial Report.xlsx",
      sheetName: "Stock Trial",
    });
  }, [stockTrialList]);

  // Update branch filter
  const handleBranchChange = useCallback((branchIdValue: string | null) => {
    setFilterParams(prev => ({
      ...prev,
      branchid: Number(branchIdValue) || Number(branchId),
    }));
  }, [branchId]);

  // ✅ Direct date handlers like Purchase Order
  const handleFromDateChange = useCallback((date: string | null) => {
    setFromDate(date);
  }, []);

  const handleToDateChange = useCallback((date: string | null) => {
    setToDate(date);
  }, []);

  return (
    <>
      <div className="stock-trial-module">
        <div className="bg-white rounded-xl shadow-sm border mt-2">
          <TransactionToolbar
            title="Stock Trial"
            permissions={permissions}
            onMoreFilter={handleMoreFilterClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
            selects={{
              name: "branch",
              value: String(filterParams.branchid),
              options: BranchOrderOptions,
              placeholder: "Select Branch",
              className: "w-48",
              onChange: handleBranchChange,
            }}
            // ✅ Direct date props like Purchase Order
            selectFromDate={{
              name: "fromDate",
              label: "From Date",
              value: fromDate,
              className: "w-40",
              isClearable: true,
              onChange: handleFromDateChange,
            }}
            selectToDate={{
              name: "toDate",
              label: "To Date",
              value: toDate,
              className: "w-40",
              isClearable: true,
              onChange: handleToDateChange,
            }}
          />
        </div>

        {!isMobile && (
          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">
            <StockTrialDataGrid
              dataSource={stockTrialList}
              onSelectionChanged={handleSelectionChanged}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}

        <StockTrialFilterCriteria
          visible={isFilterFormOpen}
          filterParams={filterParams}
          onClose={handleFilterFormClose}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </div>
    </>
  );
}