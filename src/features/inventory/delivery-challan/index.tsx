'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DeliveryChallanDataGrid } from './components/DeliveryChallanGrid';
import { DeliveryChallanForm } from './components/DeliveryChallanForm';
import { useDeliveryChallan, usePrintDeliveryChallan } from './hooks/useDeliveryChallan';
import { DeliveryChallan, OperationMode } from './types/deliveryChallan.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate, formatDate } from '@/helpers/dateUtils';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';
import Loader from '@/common/components/Loader';


export default function DeliveryChallanModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();
  const { mutate: printDeliveryChallan, isPending: isPrinting } = usePrintDeliveryChallan();

  // State 
  const [selectedRow, setselectedRow] = useState<DeliveryChallan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formDeliveryChallanId, setFormDeliveryChallanId] = useState(0);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const { data: DeliveryChallanList = [], isLoading, refetch } =
    useDeliveryChallan({
      userid: Number(userId),
      compid: Number(companyId),
      skip: 0,
      take: 200,
      branchid: Number(toolbarBranchId) || Number(branchId),
      finid: Number(finid),
      startdt: fromDate || "",
      enddt: toDate || "",
    });

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
      setFormDeliveryChallanId(0);
      setselectedRow(null);
    } else {
      setFormDeliveryChallanId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormDeliveryChallanId(0);
  }, []);

  // Toolbar handlers
  const handleAddClick = useCallback(() => {
    setselectedRow(null);
    openForm('Add');
  }, [openForm]);
  const handleEditClick = useCallback(() => openForm('Edit'), [openForm]);
  const handleDeleteClick = useCallback(() => openForm('Delete'), [openForm]);
  const handleViewClick = useCallback(() => openForm('View'), [openForm]);
  //const handlePrintClick = useCallback(() => openForm('Print'), [openForm]);

  const handlePrintClick = useCallback(() => {
    if (!selectedRow) return;

    printDeliveryChallan(selectedRow.id || 0);
  }, [printDeliveryChallan, selectedRow]);


  const handleRefresh = useCallback(() => {
    refetch();
    setFormDeliveryChallanId(0);
    setselectedRow(null);
    setToolbarBranchId(null);
    setFromDate(currentDate);
    setToDate(currentDate);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!DeliveryChallanList || DeliveryChallanList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(DeliveryChallanList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: DeliveryChallanList,
      columns,
      fileName: "Pick List List.xlsx",
      sheetName: "Pick List",
    });
  }, [DeliveryChallanList]);


  return (
    <>
      <div className="Sale-order-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-1">

          <TransactionToolbar
            title="Pick Lists"
            // periodTitle='Period: 2026-2027'
            permissions={permissions}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRefresh={handleRefresh}
            onView={handleViewClick}
            onPrint={handlePrintClick}
            isPrinting={isPrinting}

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
            <DeliveryChallanDataGrid
              dataSource={DeliveryChallanList}
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
          <DeliveryChallanForm
            visible={isFormOpen}
            onClose={handleFormClose}
            formDeliveryChallanId={formDeliveryChallanId}
            formSelectedBranch={formSelectedBranch || branchnm}
            toolbarBranchId={Number(toolbarBranchId) || Number(branchId)}
            mode={formMode}
          />
        )}

        {isLoading && <Loader />}

      </div>
    </>
  );
}