'use client';

import { useState, useCallback, useEffect } from 'react';
import { SaleRegisterDataGrid } from './components/SaleRegisterDataGrid';
import { useSaleRegisterList } from './hooks/useSaleRegister';
import { SaleRegister } from './types/saleRegister.type';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from './components/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate, formatDate } from '@/helpers/dateUtils';
import SaleRegisterFilterCriteria from './components/SaleRegisterFilterCriteria';
import {
  SaleRegisterFilterState,
  formatDateForApi
} from './types/saleRegister.type';
import { DEFAULT_SALE_REGISTER_FILTER } from './constants/saleRegisterTrialDefaults';
import { storageService } from '@/common/utility/storageService';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';

export default function SaleRegisterModule() {
  // Hooks
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setSelectedRow] = useState<SaleRegister | null>(null);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<Partial<SaleRegisterFilterState>>({});

  // Modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SaleRegister | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(branchnm || '');
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');


  // Direct date state like Purchase Order
  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  // Centralized filter state for advanced filters (not dates)
  const [filterParams, setFilterParams] = useState<SaleRegisterFilterState>({
    ...DEFAULT_SALE_REGISTER_FILTER,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: Number(branchId),
    finid: Number(finid),
    startdt: formatDateForApi(currentDate),
    enddt: formatDateForApi(currentDate)
  });

  const { data: saleRegisterList = [], isLoading, refetch } = useSaleRegisterList({
    userid: filterParams.userid,
    compid: filterParams.compid,
    branchid: Number(toolbarBranchId) || filterParams.branchid,
    finid: filterParams.finid,
    startdt: fromDate ? formatDateForApi(fromDate) : formatDateForApi(currentDate),
    enddt: toDate ? formatDateForApi(toDate) : formatDateForApi(currentDate),
    sortby: filterParams.sortby,
    stateid: filterParams.stateid,
    trantype: filterParams.trantype,
    withProduct: filterParams.withProduct // Pass the withProduct value
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
        value: String(s.id),
        label: s.name,
      })),
  });

  useEffect(() => {
    console.log(filterParams)
  }, [])

  // Refetch when dates, branch, or advanced filters change
  useEffect(() => {
    refetch();
  }, [fromDate, toDate, toolbarBranchId, filterParams, refetch]);

  // Initialize selected branch name on component mount
  useEffect(() => {
    setSelectedBranchName(branchnm || '');
  }, [branchnm]);

  // Handlers
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      setSelectedRow(e.selectedRowsData[0]);
    } else {
      setSelectedRow(null);
    }
  }, []);

  // Double-click handler
  const handleRowDblClick = useCallback((e: any) => {
    if (e.data) {
      setSelectedProduct(e.data);
      setIsDetailsModalOpen(true);
    }
  }, []);

  // Modal close handler
  const handleDetailsModalClose = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleMoreFilterClick = useCallback(() => {
    setIsFilterFormOpen(true);
  }, []);

  const handleFilterFormClose = useCallback(() => {
    setIsFilterFormOpen(false);
  }, []);

  const handleApplyFilters = useCallback((filters: Partial<SaleRegisterFilterState>) => {
    setFilterParams(prev => ({
      ...prev,
      userid: Number(userId),
      compid: Number(companyId),
      finid: Number(finid),
      ...filters,
      branchid: filters.branchid !== undefined ? filters.branchid : prev.branchid,
      startdt: filters.startdt || prev.startdt,
      enddt: filters.enddt || prev.enddt,
    }));

    // ✅ NEW: Sync the popup dates back to the toolbar states!
    if (filters.startdt) {
      setFromDate(filters.startdt);
    }
    if (filters.enddt) {
      setToDate(filters.enddt);
    }

    setIsFilterFormOpen(false);
  }, [userId, companyId, finid]);
  const stateId = storageService.getItem('stateid');

  const handleClearFilters = useCallback(() => {
    setFilterParams({
      ...DEFAULT_SALE_REGISTER_FILTER,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: Number(branchId),  // Keep the original branch
      finid: Number(finid),
      startdt: formatDateForApi(currentDate),
      enddt: formatDateForApi(currentDate),
      sortby: 0,
      stateid: Number(stateId) | 0,
      trantype: 0,
      withProduct: 0
    });
    setFromDate(currentDate);
    setToDate(currentDate);
    setToolbarBranchId(null);
    setFormSelectedBranch(null);
    setSelectedBranchName(branchnm || '');
  }, [userId, companyId, branchId, finid, branchnm]);

  const handleRefresh = useCallback(() => {
    handleClearFilters();
  }, [handleClearFilters]);

  const handleExport = useCallback(() => {
    if (!saleRegisterList || saleRegisterList.length === 0) return;

    const columns: ExcelColumn[] = Object.keys(saleRegisterList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: saleRegisterList,
      columns,
      fileName: "Stock Trial Report.xlsx",
      sheetName: "Stock Trial",
    });
  }, [saleRegisterList]);

  // Update branch handler
  const handleBranchChange = useCallback((branchIdValue: string | null) => {
    setToolbarBranchId(branchIdValue);
    if (branchIdValue) {
      const branch = BranchOrderOptions.find((b: any) => b.value === branchIdValue);
      const branchName = branch?.label || branchnm || '';
      setSelectedBranchName(branchName);
      setFormSelectedBranch(branchName);
      setFilterParams(prev => ({
        ...prev,
        branchid: Number(branchIdValue),
      }));
    } else {
      setSelectedBranchName(branchnm || '');
      setFormSelectedBranch(branchnm || '');
    }
  }, [BranchOrderOptions, branchnm]);

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
            title="Sale Register"
            permissions={permissions}
            onMoreFilter={handleMoreFilterClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
            periodTitle={`Period: ${fromDate} to ${toDate}`}
            selects={{
              name: "branch",
              label: "Branch",
              value: toolbarBranchId || String(branchId),
              options: BranchOrderOptions,
              placeholder: "Select Branch",
              className: "w-48",
              onChange: (val) => {
                handleBranchChange(val);
                if (val) {
                  const branch = BranchOrderOptions.find((b: any) => b.value === val);
                  setFormSelectedBranch(branch?.label || branchnm);
                }
              }
            }}
            selectFromDate={{
              name: "fromDate",
              label: "From",
              value: fromDate,
              className: "w-40",
              isClearable: true,
              onChange: handleFromDateChange,
            }}
            selectToDate={{
              name: "toDate",
              label: "To ",
              value: toDate,
              className: "w-40",
              isClearable: true,
              onChange: handleToDateChange,
            }}
          />
        </div>

        {!isMobile && (
          <div
            className={`
      ${sidebarState === '1' ? 'w-358' : 'w-294'}
      transition-all duration-300 ease-in-out
      px-2 sm:px-2 md:px-2 bg-white lg:px-2
      rounded-xl shadow-sm border border-gray-200
      p-2 overflow-x-auto my-4
    `}
          >
            <SaleRegisterDataGrid
              dataSource={saleRegisterList}
              onSelectionChanged={handleSelectionChanged}
              onRowDblClick={handleRowDblClick}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
              localFilters={localFilters}
            />
          </div>
        )}

        <SaleRegisterFilterCriteria
          visible={isFilterFormOpen}
          filterParams={filterParams}
          onClose={handleFilterFormClose}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
        />


      </div>
    </>
  );
}