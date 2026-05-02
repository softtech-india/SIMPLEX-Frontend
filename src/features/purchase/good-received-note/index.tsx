'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { GoodReceivedNoteDataGrid } from './components/GoodReceivedNoteDataGrid';
import { GoodReceivedNoteForm } from './components/GoodReceivedNoteForm';
import { useGoodReceivedNoteList } from './hooks/useGoodReceivedNote';
import { GoodReceivedNote, OperationMode } from './types/goodReceivedNote.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { TransactionToolbar } from '@/common/components/barmanager/TransactionToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { fetchBranchList } from "@/api/master/ledger-api";
import { useQuery } from '@tanstack/react-query';
import useUserStore from '@/store/userStore';
import { currentDate } from '@/helpers/dateUtils';


export default function PurchaseOrderModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 
  const [selectedRow, setselectedRow] = useState<GoodReceivedNote | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formGoodReceivedNoteId, setFormGoodReceivedNoteId] = useState(0);
  const [toolbarBranchId, setToolbarBranchId] = useState<string | null>(null);
  const [formSelectedBranch, setFormSelectedBranch] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState<string | null>(currentDate);
  const [toDate, setToDate] = useState<string | null>(currentDate);

  const { data: goodReceivedNotelist = [], isLoading, refetch } = useGoodReceivedNoteList({
    userid: Number(userId),
    compid: Number(companyId),
    skip: 0,
    take: 200,
    branchid: Number(toolbarBranchId) || Number(branchId),
    finid: Number(finid),
    startdt: fromDate || "",
    enddt: toDate || "",
  });

  // useEffect(() => {
  //   console.log('goodReceivedNotelist :', goodReceivedNotelist);
  //   console.log('branch :', toolbarBranchId);
  //   console.log('fromDate :', fromDate);
  //   console.log('toDate :', toDate);
  // }, [goodReceivedNotelist, toolbarBranchId, fromDate, toDate])

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
      setFormGoodReceivedNoteId(0);
      setselectedRow(null);
    } else {
      setFormGoodReceivedNoteId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormGoodReceivedNoteId(0);
  }, []);

  // Toolbar handlers
  const handleAddClick = useCallback(() => {
    setselectedRow(null);
    openForm('Add');
  }, [openForm]);

  const handleEditClick = useCallback(() => {
    if (selectedRow?.isconfirm === "Y") return;
    openForm('Edit')
  }, [openForm]);

  const handleDeleteClick = useCallback(() => {
    openForm('Delete')
  }, [openForm]);

  const handleViewClick = useCallback(() => openForm('View'), [openForm]);
  const handlePrintClick = useCallback(() => openForm('Print'), [openForm]);
  const handleConfirmedClick = useCallback(() => {
    if (selectedRow?.isconfirm === "Y") return;
    // console.log('selectedRow : ', selectedRow);
    openForm('Confirmed')
  }, [openForm]);


  const handleRefresh = useCallback(() => {
    refetch();
    setFormGoodReceivedNoteId(0);
    setselectedRow(null);
    setToolbarBranchId(null);
    setFromDate(currentDate);
    setToDate(currentDate);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!goodReceivedNotelist || goodReceivedNotelist.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(goodReceivedNotelist[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: goodReceivedNotelist,
      columns,
      fileName: "Good Received Note List.xlsx",
      sheetName: "Good Received Note",
    });
  }, [goodReceivedNotelist]);


  // Confirmation Check Ponit
  const isRowConfirmed = selectedRow?.isconfirm === "Y";
  // useEffect(() => {
  //   console.log("isRowConfirmed :", isRowConfirmed);
  // }, [selectedRow]);

  return (
    <>
      <div className="purchase-order-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-2">

          <TransactionToolbar
            title="Good received Note"
            // periodTitle='Period: 2026-2027' 
            permissions={permissions}
            onAdd={handleAddClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRefresh={handleRefresh}
            onView={handleViewClick}
            onPrint={handlePrintClick}
            onConfirmed={handleConfirmedClick}
            // hasSelection={!!selectedRow}
            isRowConfirmed={isRowConfirmed}

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
          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">
            <GoodReceivedNoteDataGrid
              dataSource={goodReceivedNotelist}
              onSelectionChanged={handleSelectionChanged}
              showFilterRow
              showColumnChooser
              selectionMode="single"
              onExporting={handleExport}
              height={500}
            />
          </div>
        )}


        <GoodReceivedNoteForm
          visible={isFormOpen}
          onClose={handleFormClose}
          formGoodReceivedNoteId={formGoodReceivedNoteId}
          formSelectedBranch={formSelectedBranch || branchnm}
          toolbarBranchId={Number(toolbarBranchId) || Number(branchId)}
          mode={formMode}
          isRowConfirmed={isRowConfirmed}
        />


        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isLoading}
          showIndicator
        />

      </div>
    </>
  );
}