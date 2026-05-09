'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { SalesManDataGrid } from './components/SalesManDataGrid';
import { SalesManForm } from './components/SalesManForm';
import { useSalesMen, useSalesMan } from './hooks/salesman';
import { SalesMan, OperationMode } from './types/salesman';
import useIsMobile from "@/common/hooks/useIsMobile";
import useUserStore from '@/store/userStore';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { useQuery } from '@tanstack/react-query';
import { fetchBranchList } from "@/api/master/ledger-api";

export default function SalesManModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();

  // State
  const [selectedRow, setselectedRow] = useState<SalesMan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formSalesManId, setFormSalesManId] = useState(0);
  const gridRef = useRef<any>(null);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);
  const { data: SalesManList = [], isLoading, refetch } = useSalesMen(toolbarBranchId);


  useEffect(() => {
    if (toolbarBranchId) {
      refetch();
    }
  }, [toolbarBranchId, refetch]);

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
      setFormSalesManId(0);
      setselectedRow(null);
    } else {
      setFormSalesManId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);;

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormSalesManId(0);
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
    setFormSalesManId(0);
    setselectedRow(null);
    setToolbarBranchId(null);

  }, [refetch]);

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

  const handleExport = useCallback(() => {
    if (!SalesManList || SalesManList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(SalesManList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: SalesManList,
      columns,
      fileName: "User SalesManList.xlsx",
      sheetName: "SalesManList",
    });
  }, [SalesManList]);


  return (
    <div className="User-Unit-module ">
      <div className="bg-white rounded-xl shadow-sm border mt-2">
        <TransactionToolbar
          title="Requisitions"
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
        <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">
          <SalesManDataGrid
            dataSource={SalesManList}
            onSelectionChanged={handleSelectionChanged}
            showFilterRow
            showColumnChooser
            selectionMode="single"
            onExporting={handleExport}
            height={500}
            toolbarBranchId={toolbarBranchId}

          />
        </div>
      )}

      <SalesManForm
        visible={isFormOpen}
        onClose={handleFormClose}
        SalesManId={formSalesManId}
        mode={formMode}
        toolbarBranchId={toolbarBranchId}
      />

      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={isLoading}
        showIndicator
      />

    </div>
  );
}