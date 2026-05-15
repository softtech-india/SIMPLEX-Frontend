'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { ProdCategoryDataGrid } from './components/ProdCategoryDataGrid';
import { ProdCategoryForm } from './components/ProdCategoryForm';
import { useProdCategories, useProdCategory } from './hooks/prodCategory';
import { ProdCategory, OperationMode } from './types/prodCategory.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { MasterToolbar } from '@/common/components/barmanager/MasterToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';

export default function ProdCategoryModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();

  // State
  const [selectedRow, setselectedRow] = useState<ProdCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formProdCategoryId, setFormProdCategoryId] = useState(0);
  const { data: ProdCategoryList = [], isLoading, refetch } = useProdCategories();
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
      setFormProdCategoryId(0);
      setselectedRow(null);
    } else {
      setFormProdCategoryId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);;

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormProdCategoryId(0);
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
    setFormProdCategoryId(0);
    setselectedRow(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!ProdCategoryList || ProdCategoryList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(ProdCategoryList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: ProdCategoryList,
      columns,
      fileName: "User Group List.xlsx",
      sheetName: "userGroupList",
    });
  }, [ProdCategoryList]);


  return (
    <div className="User-Group-module ">

      <div className="bg-white rounded-xl shadow-sm border mt-2">
        <MasterToolbar
          title="User Group Master"
          permissions={permissions}
          //  hasSelection={!!selectedRow}
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
          <ProdCategoryDataGrid
            dataSource={ProdCategoryList}
            onSelectionChanged={handleSelectionChanged}
            showFilterRow
            showColumnChooser
            selectionMode="single"
            onExporting={handleExport}
            height={500}
          />
        </div>
      )}

      <ProdCategoryForm
        visible={isFormOpen}
        onClose={handleFormClose}
        ProdCategoryId={formProdCategoryId}
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