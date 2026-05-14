// sales-order-register/index-grn.tsx

'use client';

import { useState, useCallback, useEffect } from 'react';
import { GRNDataGrid } from './components/GRNRegisterDataGrid';
import { useGRNList } from './hooks/useGrnRegister';
import { GRN, GRNFilterState, formatDateForApi } from './types/grnRegister.type';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from './components/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate } from '@/helpers/dateUtils';
import GRNFilterCriteria from './components/GRNFilterCriteria';
import { DEFAULT_GRN_FILTER } from './constants/grnRegisterDefaults';
import { storageService } from '@/common/utility/storageService';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';

export default function GRNRegisterModule() {
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  const [selectedRow, setSelectedRow] = useState<GRN | null>(null);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(branchnm || '');
  const [localFilters, setLocalFilters] = useState<Partial<GRNFilterState>>({});

  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  const stateId = storageService.getItem('stateid');
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const [filterParams, setFilterParams] = useState<GRNFilterState>({
    ...DEFAULT_GRN_FILTER,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: Number(branchId),
    finid: Number(finid),
    startdt: formatDateForApi(currentDate),
    enddt: formatDateForApi(currentDate),
    strbrand: '',
    strclass: '',
    strparty: '',
    stateid: Number(stateId) || 0,
  });

  const { data: grnList = [], isLoading, refetch } = useGRNList({
    userid: filterParams.userid,
    compid: filterParams.compid,
    branchid: Number(toolbarBranchId) || filterParams.branchid,
    finid: filterParams.finid,
    startdt: fromDate ? formatDateForApi(fromDate) : formatDateForApi(currentDate),
    enddt: toDate ? formatDateForApi(toDate) : formatDateForApi(currentDate),
    strbrand: filterParams.strbrand || ' ',
    strclass: filterParams.strclass || ' ',
    strparty: filterParams.strparty || ' ',
    stateid: filterParams.stateid,
  });

  const { data: BranchOrderOptions = [] } = useQuery({
    queryKey: ["GRNBranchOrderOptions", userId, companyId],
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
    refetch();
  }, [fromDate, toDate, toolbarBranchId, filterParams, refetch]);

  useEffect(() => {
    console.log(sidebarState)
    setSelectedBranchName(branchnm || '');
  }, [branchnm]);

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

  const handleApplyFilters = useCallback((filters: Partial<GRNFilterState>) => {
    setFilterParams((prev: GRNFilterState) => ({
      ...prev,
      ...filters,
    }));

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
      ...DEFAULT_GRN_FILTER,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: Number(branchId),
      finid: Number(finid),
      startdt: formatDateForApi(currentDate),
      enddt: formatDateForApi(currentDate),
      strbrand: '',
      strclass: '',
      strparty: '',
      stateid: Number(stateId) || 0,
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
    if (!grnList || grnList.length === 0) return;

    const columns: ExcelColumn[] = Object.keys(grnList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: grnList,
      columns,
      fileName: "GRN Register.xlsx",
      sheetName: "GRN Register",
    });
  }, [grnList]);

  const handleBranchChange = useCallback((branchIdValue: string | null) => {
    setToolbarBranchId(branchIdValue);
    if (branchIdValue) {
      const branch = BranchOrderOptions.find((b: any) => b.value === branchIdValue);
      const branchName = branch?.label || branchnm || '';
      setSelectedBranchName(branchName);
      setFilterParams((prev: GRNFilterState) => ({
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
      <div className="grn-module">
        <div className="bg-white rounded-xl shadow-sm border mt-2">
          <TransactionToolbar
            title="GRN Register"
            permissions={permissions}
            onMoreFilter={handleMoreFilterClick}
            onRefresh={handleRefresh}
            onExport={handleExport}
            periodTitle={`Period: ${fromDate} to ${toDate}`}
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
            <GRNDataGrid
              dataSource={grnList}
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
        <GRNFilterCriteria
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