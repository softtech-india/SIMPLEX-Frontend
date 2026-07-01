'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { DirectSaleDataGrid } from './components/DirectSaleDataGrid';
import { DirectSaleForm } from './components/DirectSaleForm';
import { useDirectSaleList, usePrintSaleBill } from './hooks/useDirectSale';
import { DirectSale, OperationMode } from './types/directSale.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate } from '@/helpers/dateUtils';
import { usePathname } from 'next/navigation';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';


export default function DirectSaleModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();
  const pathname = usePathname();
  const { mutate: printSaleBill, isPending: isPrinting } = usePrintSaleBill();

  const isOrderBasedSale = pathname?.includes("saleagnstorder");
  const saleListType = `${isOrderBasedSale ? "O" : "D"}`;

  // State 
  const [selectedRow, setselectedRow] = useState<DirectSale | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formDirectSaleId, setFormDirectSaleId] = useState(0);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  const isRowApproved = selectedRow?.aprvstatus === "A";

  const { data: DirectSaleList = [], isLoading, refetch } =
    useDirectSaleList({
      userid: Number(userId),
      compid: Number(companyId),
      skip: 0,
      take: 200,
      branchid: Number(toolbarBranchId) || Number(branchId),
      finid: Number(finid),
      startdt: fromDate || "",
      enddt: toDate || "",
      entrytype: saleListType,
    });

  useEffect(() => {

  }, [DirectSaleList])

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
    }
  }, []);

  const openForm = useCallback((mode: OperationMode) => {
    if (mode !== 'Add' && !selectedRow) return;

    if (mode === 'Add') {
      setFormDirectSaleId(0);
      setselectedRow(null);
    } else {
      setFormDirectSaleId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormDirectSaleId(0);
  }, []);

  // Toolbar handlers
  const handleAddClick = useCallback(() => {
    setselectedRow(null);
    openForm('Add');
  }, [openForm]);
  const handleEditClick = useCallback(() => openForm('Edit'), [openForm]);
  const handleDeleteClick = useCallback(() => openForm('Delete'), [openForm]);
  const handleViewClick = useCallback(() => openForm('View'), [openForm]);

  const handlePrintClick = useCallback(() => {
    if (!selectedRow) return;

    printSaleBill(selectedRow.id);
  }, [printSaleBill, selectedRow]);

  const handleApproveClick = useCallback(() => {
    if (isRowApproved) return;
    openForm("Approve");
  }, [isRowApproved, openForm]);

  const handleRefresh = useCallback(() => {
    refetch();
    setFormDirectSaleId(0);
    setselectedRow(null);
    setToolbarBranchId(null);
    setFromDate(currentDate);
    setToDate(currentDate);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!DirectSaleList || DirectSaleList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(DirectSaleList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: DirectSaleList,
      columns,
      fileName: "Direct Sale List.xlsx",
      sheetName: "Direct Sale",
    });
  }, [DirectSaleList]);

  // useEffect(() => {
  //   console.log("formSelectedBranch :", formSelectedBranch);
  // }, [formSelectedBranch]);

  return (
    <>
      <div className="Sale-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-1">

          <TransactionToolbar
            title="Direct Sales"
            // periodTitle='Period: 2026-2027'
            permissions={permissions}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onApprove={handleApproveClick}
            onDelete={handleDeleteClick}
            onRefresh={handleRefresh}
            onView={handleViewClick}
            onPrint={handlePrintClick}
            isPrinting={isPrinting}

            isRowApproved={isRowApproved}

            selectFromDate={{
              name: "fromDate",
              label: "From",
              value: fromDate,
              className: "w-40",
              isClearable: true,
              onChange: setFromDate,
            }}

            selectToDate={{
              name: "toDate",
              label: "To",
              value: toDate,
              className: "w-40",
              isClearable: true,
              onChange: setToDate,
            }}

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
          <div className={` ${sidebarState === '1' ? 'w-358' : 'w-294'} transition-all duration-300 ease-in-out 
           bg-white rounded-xl shadow-sm border border-gray-200 p-1 overflow-x-auto my-1 `}
          >
            <DirectSaleDataGrid
              dataSource={DirectSaleList}
              onSelectionChanged={handleSelectionChanged}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}


        {isFormOpen && (
          <DirectSaleForm
            visible={isFormOpen}
            onClose={handleFormClose}
            formDirectSaleId={formDirectSaleId}
            formSelectedBranch={formSelectedBranch || branchnm}
            toolbarBranchId={Number(toolbarBranchId) || Number(branchId)}
            mode={formMode}
          />
        )}

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isLoading}
          showIndicator
        />

      </div>
    </>
  );
}