'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { BillTypeDataGrid } from './components/BillTypeDataGrid';
import { BillTypeForm } from './components/BillTypeForm';
import { useBillTypes, useBillType } from './hooks/billtype';
import { BillType, OperationMode } from './types/billtype.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { MasterToolbar } from '@/common/components/barmanager/MasterToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';

export default function BillTypeModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();

  // State
  const [selectedRow, setselectedRow] = useState<BillType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formBillTypeId, setFormBillTypeId] = useState(0);
  const { data: BillTypeList = [], isLoading, refetch } = useBillTypes();
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const gridRef = useRef<any>(null);

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
      setFormBillTypeId(0);
      setselectedRow(null);
    } else {
      setFormBillTypeId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);;

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormBillTypeId(0);
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
    setFormBillTypeId(0);
    setselectedRow(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!BillTypeList || BillTypeList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(BillTypeList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: BillTypeList,
      columns,
      fileName: "User BillTypeList.xlsx",
      sheetName: "BillTypeList",
    });
  }, [BillTypeList]);


  return (
    <div className="User-Unit-module ">
      <div className="bg-white rounded-xl shadow-sm border mt-2">
        <MasterToolbar
          title="User Unit Master"
          permissions={permissions}
          hasSelection={!!selectedRow}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRefresh={handleRefresh}
          onView={handleViewClick}
          onPrint={handlePrintClick}
          onExport={handleExport}
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
          <BillTypeDataGrid
            dataSource={BillTypeList}
            onSelectionChanged={handleSelectionChanged}
            showFilterRow
            showColumnChooser
            selectionMode="single"
            onExporting={handleExport}
            height={500}
          />
        </div>
      )}

      <BillTypeForm
        visible={isFormOpen}
        onClose={handleFormClose}
        BillTypeId={formBillTypeId}
        mode={formMode}
      />

      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={isLoading}
        showIndicator
      />

    </div>
  );
}