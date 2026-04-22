'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { UserBranchMappingDataGrid } from './components/UserBranchMappingDataGrid';
import { UserBranchMappingForm } from './components/UserBranchMappingForm';
import { useUserBranchMappingList } from './hooks/useUserBranchMapping';
import { UserBranchMapping, OperationMode } from './types/userBranchMapping.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { MasterToolbar } from '@/common/components/barmanager/MasterToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { useQuery } from '@tanstack/react-query';
import { useAppStorage } from '@/hooks/useAuthStorage';
import { fetchUsersList } from '@/api/master/ledger-api';
import { FormSelect } from '@/common/components/FormSelect';
import { useForm } from 'react-hook-form';

type Option = { value: number | string; label: string };

export default function UserModule() {

  // Hooks
  const isMobile = useIsMobile();
  const permissions = usePrivileges();
  const { userId } = useAppStorage();

  // Form
  const { control, watch } = useForm({
    defaultValues: {
      mapuserid: null,
    },
  });

  // State
  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(null);
  const [selectedRow, setSelectedRow] = useState<UserBranchMapping | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formDataId, setFormDataId] = useState(0);
  const [formDataCompId, setFormDataCompId] = useState(0);

  // Watch dropdown value
  const selectedUser = watch("mapuserid");

  useEffect(() => {
    console.log("Selected User ID:", selectedUser);
    setSelectedUserId(selectedUser || null);
  }, [selectedUser]);

  // Fetch mappings
  const { data: userBranchMappingsList = [], isLoading, refetch } = useUserBranchMappingList(selectedUserId as number);

  // Filtered data (based on selected user)
  const filteredData = useMemo(() => {
    if (!selectedUserId) return [];

    return userBranchMappingsList.filter(
      (item: any) => item.userid === selectedUserId
    );
  }, [userBranchMappingsList, selectedUserId]);

  // Fetch users
  const { data: userList = [] } = useQuery({
    queryKey: ["userList", userId],
    queryFn: () => fetchUsersList(userId),
    staleTime: 0,
    retry: 1,
    enabled: !!userId,
  });

  const userOptions: Option[] = useMemo(
    () =>
      userList.map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
    [userList]
  );

  // Handlers
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData?.length > 0) {
      setSelectedRow(e.selectedRowsData[0]);
    } else {
      setSelectedRow(null);
    }
  }, []);

  const openForm = useCallback((mode: OperationMode) => {
    if (mode !== 'Add' && !selectedRow) return;

    if (mode === 'Add') {
      setFormDataId(0);
      setSelectedRow(null);
    } else {
      setFormDataId(selectedRow?.brnchid ?? 0);
      setFormDataCompId(selectedRow?.compid ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormDataId(0);
    setFormDataCompId(0);
  }, []);

  // Toolbar
  const handleAddClick = () => openForm('Add');
  const handleEditClick = () => openForm('Edit');
  const handleDeleteClick = () => openForm('Delete');
  const handleViewClick = () => openForm('View');
  const handlePrintClick = () => openForm('Print');

  const handleRefresh = useCallback(() => {
    refetch();
    setSelectedRow(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!filteredData.length) return;

    const columns: ExcelColumn[] = Object.keys(filteredData[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: filteredData,
      columns,
      fileName: "User Branch Mappings.xlsx",
      sheetName: "User Branch Mappings",
    });
  }, [filteredData]);

  return (
    <div className="User-Branch-Mappings-module">

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border mt-2">
        <MasterToolbar
          title="User Branch Mapping"
          permissions={permissions}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRefresh={handleRefresh}
          onView={handleViewClick}
          onPrint={handlePrintClick}
          onExport={handleExport}
        />
      </div>

      {/* Content */}
      {!isMobile && (
        <>

          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">

            {/* Dropdown */}
            <div className="mb-1">
              <FormSelect
                name="mapuserid"
                control={control}
                options={userOptions}
                placeholder="Select user"
                className='w-full md:w-100'
                isDisabled={false}
              />
            </div>
          </div>


          <div className="w-full px-2 sm:px-2 md:px-2 lg:px-2 max-w-full lg:max-w-355 bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-x-auto my-4">

            {/* Data Grid */}
            {selectedUserId ? (
              <UserBranchMappingDataGrid
                dataSource={filteredData}
                onSelectionChanged={handleSelectionChanged}
                showFilterRow
                showColumnChooser
                selectionMode="single"
                onExporting={handleExport}
                height={500}
              />
            ) : (
              <div className="text-gray-500 text-center py-10">
                Please select a user to view data
              </div>
            )}
          </div>

        </>

      )}

      {/* Form */}
      <UserBranchMappingForm
        visible={isFormOpen}
        onClose={handleFormClose}
        formDataId={formDataId}
        mode={formMode}
        selectedUserId={selectedUserId}
        formDataCompId={formDataCompId}
        userList={userList}
      />

      {/* Loader */}
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={isLoading}
        showIndicator
      />
    </div>
  );
}