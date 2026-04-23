'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { PurchaseOrderDataGrid } from './components/PurchaseOrderDataGrid';
import { PurchaseOrderForm } from './components/PurchaseOrderForm';
import { usePurchaseOrderList } from './hooks/usePurchaseOrder';
import { PurchaseOrder, OperationMode } from './types/purchaseOrder.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import { useAppStorage } from '@/hooks/useAuthStorage';
import useUserStore from '@/store/userStore';

function formatDate(date: Date | null): string {
  if (!date) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function PurchaseOrderModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();
  //  const { userId, companyId } = useAppStorage();

  const {
    userId,
    companyId,
    branchId,
    finid
  } = useUserStore();

  // State 
  const [selectedRow, setselectedRow] = useState<PurchaseOrder | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formPurchaseOrderId, setFormPurchaseOrderId] = useState(0);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const { data: purchaseOrderList = [], isLoading, refetch } =
    usePurchaseOrderList({
      userid: Number(userId),
      compid: Number(companyId),
      skip: 0,
      take: 200,
      branchid: Number(branchId),
      finid: Number(finid),
      startdt: "2025-04-01",
      enddt: "2027-03-31",
    });

  // useEffect(() => {
  //   console.log('branch :', toolbarBranchId);
  //   console.log('fromDate :', formatDate(fromDate));
  //   console.log('toDate :', formatDate(toDate));
  // }, [toolbarBranchId, fromDate, toDate])

  // Fetch dropdown options
  const { data: purchaseOrderOptions = [] } = useQuery({
    queryKey: ["purchaseOrderList", userId, companyId],
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
      setFormPurchaseOrderId(0);
      setselectedRow(null);
    } else {
      setFormPurchaseOrderId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormPurchaseOrderId(0);
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
    setFormPurchaseOrderId(0);
    setselectedRow(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!purchaseOrderList || purchaseOrderList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(purchaseOrderList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: purchaseOrderList,
      columns,
      fileName: "purchase order List.xlsx",
      sheetName: "purchase order",
    });
  }, [purchaseOrderList]);


  return (
    <>
      <div className="purchase-order-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-2">

          <TransactionToolbar
            title="Purchse Orders"
            // periodTitle='Period: 2026-2027'
            permissions={permissions}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
            onPrint={handlePrintClick}
            selects={{
              name: "branch",
              label: "Branch",
              value: toolbarBranchId || branchId,
              options: purchaseOrderOptions,
              placeholder: "Select Branch",
              className: "w-48",
              disabled: !!branchId,
              onChange: (val) => setToolbarBranchId(val),
            }}

            selectFromDate={{
              name: "fromDate",
              label: "From Date",
              value: fromDate,
              placeholder: "Select from date",
              className: "w-40",
              isClearable: true,
              dateFormat: "dd-MM-yyyy",
              onChange: setFromDate,
            }}

            selectToDate={{
              name: "toDate",
              label: "To Date",
              value: toDate,
              placeholder: "Select to date",
              className: "w-40",
              isClearable: true,
              dateFormat: "dd-MM-yyyy",
              onChange: setToDate,
            }}

          />


        </div>

        {!isMobile && (
          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">
            <PurchaseOrderDataGrid
              dataSource={purchaseOrderList}
              onSelectionChanged={handleSelectionChanged}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}


        <PurchaseOrderForm
          visible={isFormOpen}
          onClose={handleFormClose}
          formPurchaseOrderId={formPurchaseOrderId}
          mode={formMode}
        />

        {/* <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={isLoading}
        showIndicator
      /> */}

      </div>
    </>
  );
}