'use client';

import { useState, useCallback, useEffect } from 'react';
import { PurchaseOrderDataGrid } from './components/PurchaseOrderDataGrid';
import { usePurchaseOrderList } from './hooks/usePurchaseOrder';
import { PurchaseOrder, PurchaseOrderFilterState, formatDateForApi } from './types/purchaseOrder.type';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from './components/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate } from '@/helpers/dateUtils';
import PurchaseOrderFilterCriteria from './components/PurchaseOrderFilterCriteria';
import { DEFAULT_PURCHASE_ORDER_FILTER } from './constants/purchaseOrderDefaults';
import { storageService } from '@/common/utility/storageService';

export default function PurchaseOrderRegisterModule() {
  // Hooks
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setSelectedRow] = useState<PurchaseOrder | null>(null);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(branchnm || '');
  const [localFilters, setLocalFilters] = useState<Partial<PurchaseOrderFilterState>>({});

  // Direct date state
  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  // Centralized filter state for advanced filters
  const stateId = storageService.getItem('stateid');

  const [filterParams, setFilterParams] = useState<PurchaseOrderFilterState>({
    ...DEFAULT_PURCHASE_ORDER_FILTER,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: Number(branchId),
    finid: Number(finid),
    startdt: formatDateForApi(currentDate),
    enddt: formatDateForApi(currentDate),
    strbrand: '',
    strclass: '',
    strsubclass: '',
    sortby: 0,
    stateid: Number(stateId) | 0,
    partyid: 0,
    orderstatus: 0
  });

  const { data: purchaseOrderList = [], isLoading, refetch } = usePurchaseOrderList({
    userid: filterParams.userid,
    compid: filterParams.compid,
    branchid: Number(toolbarBranchId) || filterParams.branchid,
    finid: filterParams.finid,
    startdt: fromDate ? formatDateForApi(fromDate) : formatDateForApi(currentDate),
    enddt: toDate ? formatDateForApi(toDate) : formatDateForApi(currentDate),
    strbrand: filterParams.strbrand || ' ',
    strclass: filterParams.strclass || ' ',
    strsubclass: filterParams.strsubclass || ' ',
    sortby: filterParams.sortby,
    stateid: filterParams.stateid,
    partyid: filterParams.partyid,
    orderstatus: filterParams.orderstatus
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

  const handleRowDblClick = useCallback((e: any) => {
    console.log('Row double clicked:', e.data);
  }, []);

  const handleMoreFilterClick = useCallback(() => {
    setIsFilterFormOpen(true);
  }, []);

  const handleFilterFormClose = useCallback(() => {
    setIsFilterFormOpen(false);
  }, []);

  const handleApplyFilters = useCallback((filters: Partial<PurchaseOrderFilterState>) => {
    setFilterParams((prev: PurchaseOrderFilterState) => ({
      ...prev,
      ...filters,
    }));

    // Sync dates from filters to toolbar
    if (filters.startdt) {
      setFromDate(filters.startdt);
    }
    if (filters.enddt) {
      setToDate(filters.enddt);
    }

    setIsFilterFormOpen(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterParams({
      ...DEFAULT_PURCHASE_ORDER_FILTER,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: Number(branchId),
      finid: Number(finid),
      startdt: formatDateForApi(currentDate),
      enddt: formatDateForApi(currentDate),
      strbrand: '',
      strclass: '',
      strsubclass: '',
      sortby: 0,
      stateid: Number(stateId) | 0,
      partyid: 0,
      orderstatus: 0
    });
    setFromDate(currentDate);
    setToDate(currentDate);
    setToolbarBranchId(null);
    setSelectedBranchName(branchnm || '');
  }, [userId, companyId, branchId, finid, branchnm]);

  const handleRefresh = useCallback(() => {
    handleClearFilters();
  }, [handleClearFilters]);

  const handleExport = useCallback(() => {
    if (!purchaseOrderList || purchaseOrderList.length === 0) return;

    const columns: ExcelColumn[] = Object.keys(purchaseOrderList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: purchaseOrderList,
      columns,
      fileName: "Purchase Order Register.xlsx",
      sheetName: "Purchase Order",
    });
  }, [purchaseOrderList]);

  const handleBranchChange = useCallback((branchIdValue: string | null) => {
    setToolbarBranchId(branchIdValue);
    if (branchIdValue) {
      const branch = BranchOrderOptions.find((b: any) => b.value === branchIdValue);
      const branchName = branch?.label || branchnm || '';
      setSelectedBranchName(branchName);
      setFilterParams((prev: PurchaseOrderFilterState) => ({
        ...prev,
        branchid: Number(branchIdValue),
      }));
    } else {
      setSelectedBranchName(branchnm || '');
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
      <div className="purchase-order-module">
        <div className="bg-white rounded-xl shadow-sm border mt-2">
          <TransactionToolbar
            title="Purchase Order Register"
            permissions={permissions}
            onMoreFilter={handleMoreFilterClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
            periodTitle={`Period: ${fromDate} to ${toDate}`}
          />
        </div>

        {!isMobile && (
          <div className="w-355 px-2 sm:px-2 md:px-2 lg:px-2 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4 flex-1">
            <PurchaseOrderDataGrid
              dataSource={purchaseOrderList}
              onSelectionChanged={handleSelectionChanged}
              onRowDblClick={handleRowDblClick}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}

        <PurchaseOrderFilterCriteria
          visible={isFilterFormOpen}
          filterParams={filterParams}
          onClose={handleFilterFormClose}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          userId={Number(userId)}
          companyId={Number(companyId)}
        />
      </div>
    </>
  );
}