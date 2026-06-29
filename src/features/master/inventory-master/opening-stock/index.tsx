'use client';

import { useState, useCallback } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { OpeningStockDataGrid } from './components/OpeningStockDataGrid';
import { OpeningStockForm } from './components/OpeningStockForm';
import { useOpeningStockList } from './hooks/useOpeningStock';
import { OpeningStock, OperationMode } from './types/openingStock.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';
import Loader from '@/common/components/Loader';

export default function OpeningStockModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setselectedRow] = useState<OpeningStock | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formOpeningStockId, setFormOpeningStockId] = useState(0);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const { data: openingStockList = [], isLoading, refetch } =
    useOpeningStockList({
      userid: Number(userId),
      compid: Number(companyId),
      branchid: Number(toolbarBranchId) || Number(branchId),
      finid: Number(finid),
    });

  // useEffect(() => {
  //   console.log('branch :', toolbarBranchId);
  //   console.log('fromDate :', fromDate);
  //   console.log('toDate :', toDate);
  // }, [toolbarBranchId, fromDate, toDate])

  // Fetch dropdown options
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
  })

  // handler
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      setselectedRow(e.selectedRowsData[0]);
    } else {
      setselectedRow(null);
    }
  }, []);

  const openForm = useCallback((mode: OperationMode) => {
    if (mode !== 'Add' && !selectedRow) return;

    if (mode === 'Add') {
      setFormOpeningStockId(0);
      setselectedRow(null);
    } else {
      setFormOpeningStockId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormOpeningStockId(0);
  }, []);

  // Toolbar handlers
  const handleAddClick = useCallback(() => {
    setselectedRow(null);
    openForm('Add');
  }, [openForm]);
  const handleEditClick = useCallback(() => openForm('Edit'), [openForm]);
  const handleDeleteClick = useCallback(() => openForm('Delete'), [openForm]);
  const handleViewClick = useCallback(() => openForm('View'), [openForm]);
  const handlePrintClick = useCallback(() => openForm('Print'), [openForm]);

  const handleRefresh = useCallback(() => {
    refetch();
    setFormOpeningStockId(0);
    setselectedRow(null);
    setToolbarBranchId(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!openingStockList || openingStockList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(openingStockList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: openingStockList,
      columns,
      fileName: "Opening stock List.xlsx",
      sheetName: "Opening stock",
    });
  }, [openingStockList]);


  return (
    <>
      <div className="opening-stock-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-2">

          <TransactionToolbar
            title="Opening Stock"
            // periodTitle='Period: 2026-2027'
            permissions={permissions}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRefresh={handleRefresh}
            onView={handleViewClick}
            onPrint={handlePrintClick}

            selectBranch={{
              name: "branch",
              label: "Branch",
              value: toolbarBranchId || branchId,
              options: BranchOrderOptions,
              placeholder: "Select Branch",
              className: "w-56",
              onChange: (val) => {
                setToolbarBranchId(val);
                const branch = BranchOrderOptions.find(
                  (b: any) => b.value === val
                );
                setFormSelectedBranch(branch?.label || branchnm);
              }
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
            <OpeningStockDataGrid
              dataSource={openingStockList}
              onSelectionChanged={handleSelectionChanged}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}


        <OpeningStockForm
          visible={isFormOpen}
          onClose={handleFormClose}
          formOpeningStockId={formOpeningStockId}
          formSelectedBranch={formSelectedBranch || branchnm}
          toolbarBranchId={Number(toolbarBranchId) || Number(branchId)}
          mode={formMode}
        />


        {isLoading && <Loader />}

      </div>
    </>
  );
}