'use client';

import { useState, useCallback, useEffect } from 'react';
import { StockTrialDataGrid } from './components/StockTrialDataGrid';
import { useStockTrialList } from './hooks/useStockTrial';
import { StockTrial } from './types/stockTrial.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from './components/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import useUserStore from '@/store/userStore';
import { formatDateForApi } from './types/stockTrial.types';
import StockTrialFilterCriteria from './components/StockTrialFilterCriteria';
import { StockLedgersModal } from './components/StockLedgerModal';
import { StockTrialFilterState } from './types/stockTrial.types';
import { DEFAULT_STOCK_TRIAL_FILTER } from './constants/stockTrialDefaults';
import { storageService } from '@/common/utility/storageService';

export default function StockTrialModule() {
  // Hooks
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setSelectedRow] = useState<StockTrial | null>(null);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<Partial<StockTrialFilterState>>({});

  // Modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StockTrial | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(branchnm || '');

  // Get branch ID from local storage via userStore (already has it)
  const defaultBranchId = Number(branchId);
  const today = new Date().toISOString().split('T')[0];

  // Centralized filter state
  const [filterParams, setFilterParams] = useState<StockTrialFilterState>({
    ...DEFAULT_STOCK_TRIAL_FILTER,
    userid: Number(userId),
    compid: Number(companyId),
    branchid: defaultBranchId, // Use branchId from local storage
    finid: Number(finid),
    startdt: today, // Set default to today
    enddt: today, // Set default to today
  });

  const { data: stockTrialList = [], isLoading, refetch } = useStockTrialList({
    userid: filterParams.userid,
    compid: filterParams.compid,
    branchid: filterParams.branchid,
    finid: filterParams.finid,
    startdt: formatDateForApi(filterParams.startdt),
    enddt: formatDateForApi(filterParams.enddt),
    printrtval: filterParams.printrtval,
    strbrand: filterParams.strbrand,
    strclass: filterParams.strclass,
    strsubclass: filterParams.strsubclass,
    balancetag: filterParams.balancetag,
    strgodown: filterParams.strgodown,
  });

  // Refetch when filterParams change
  useEffect(() => {
    refetch();
  }, [filterParams, refetch]);

  const [BranchOrderOptions, setBranchOrderOptions] = useState<{ value: string; label: string }[]>([]);
  // Update selected branch name when branch changes
  useEffect(() => {
    if (filterParams.branchid && BranchOrderOptions.length > 0) {
      const branch = BranchOrderOptions.find((b: any) => b.value === String(filterParams.branchid));
      setSelectedBranchName(branch?.label || branchnm || '');
    } else {
      setSelectedBranchName(branchnm || '');
    }
  }, [filterParams.branchid, BranchOrderOptions, branchnm]);

  // Fetch branch options for display in modal

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { fetchBranchList } = await import('@/api/master/ledger-api');
        const data = await fetchBranchList(userId, companyId);
        setBranchOrderOptions(
          (data ?? []).map((s: any) => ({
            value: String(s.id),
            label: s.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    if (companyId && userId) {
      fetchBranches();
    }
  }, [userId, companyId]);

  // Handlers
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      setSelectedRow(e.selectedRowsData[0]);
    } else {
      setSelectedRow(null);
    }
  }, []);

  const handleRowDblClick = useCallback((e: any) => {
    if (e.data) {
      setSelectedProduct(e.data);
      setIsDetailsModalOpen(true);
    }
  }, []);

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
      branchid: defaultBranchId, // Keep the default branch from local storage on clear
      finid: Number(finid),
      startdt: today, // Reset to today
      enddt: today, // Reset to today
    });
    setSelectedBranchName(branchnm || '');
  }, [userId, companyId, defaultBranchId, finid, branchnm, today]);

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
          />
        </div>

        {!isMobile && (
          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">
            <StockTrialDataGrid
              dataSource={stockTrialList}
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

        <StockTrialFilterCriteria
          visible={isFilterFormOpen}
          filterParams={filterParams}
          onClose={handleFilterFormClose}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
        />

        <StockLedgersModal
          visible={isDetailsModalOpen}
          onClose={handleDetailsModalClose}
          selectedRow={selectedProduct}
          branchId={filterParams.branchid}
          branchName={selectedBranchName || branchnm || ''}
          startDate={filterParams.startdt}
          endDate={filterParams.enddt}
          godownIds={filterParams.strgodown}
        />
      </div>
    </>
  );
}