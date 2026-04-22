import React, { use, useEffect, useMemo, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useUserBranchMapping, useCreateUserBranchMapping, useUpdateUserBranchMapping, useDeleteUserBranchMapping } from "../hooks/useUserBranchMapping";
import { UserBranchMappingFormType, OperationMode } from "../types/userBranchMapping.types";
import { userBranchMappingFormSchema } from "../schemas/userBranchMapping.schema";
import { userBranchMappingFormDefaults } from "../constants/userBranchMappingFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { useUserForm } from "../hooks/useUserBranchMappingForm";
import { yesNoTags, Statustype, } from "@/common/utility/data"
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { fetchBranchList, fetchCompanySelectionList } from "@/api/master/ledger-api";
import { useAppStorage } from "@/hooks/useAuthStorage";


interface UserFormProps {
  visible: boolean;
  onClose: () => void;
  formDataId: number;
  mode: OperationMode;
  selectedUserId: number | string | null;
  formDataCompId: number;
  userList: any[];
}

type Option = { value: number | string; label: string };

export function UserBranchMappingForm({ visible, onClose, formDataId, mode, selectedUserId, formDataCompId, userList }: UserFormProps) {

  const { userId } = useAppStorage();
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";


  const {
    register,
    control,
    watch,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useUserForm(userBranchMappingFormDefaults);
  const selectedCompId = watch("compid");


  const { data: userBranchMappingList, isLoading: isLoadingUser } = useUserBranchMapping(selectedUserId as number, formDataId, formDataCompId);
  const createMutation = useCreateUserBranchMapping();
  const updateMutation = useUpdateUserBranchMapping();
  const deleteMutation = useDeleteUserBranchMapping(formDataCompId, formDataId, selectedUserId as number);
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
  if (!visible) return;

  if (mode === 'Add') {
    reset({
      ...userBranchMappingFormDefaults,
      mapuserid: Number(selectedUserId) || 0,
    });
    return;
  }

  if ( userBranchMappingList) {
    const record = Array.isArray(userBranchMappingList)
      ? userBranchMappingList[0]
      : userBranchMappingList;

    reset({
      ...record,
      mapuserid: record.mapuserid ?? selectedUserId ?? 0,
      brnchid: record.brnchid ?? 0,
    });
  }

}, [userBranchMappingList, mode, visible, reset, selectedUserId]);


  const { data: companyList = [] } = useQuery({
    queryKey: ["companyList", userId],
    queryFn: () => fetchCompanySelectionList(userId),
    staleTime: 0,
    retry: 1,
    enabled: !!visible,
  });

  const { data: branchList = [] } = useQuery({
    queryKey: ["branchList", userId],
    queryFn: () => fetchBranchList(userId, selectedCompId),
    staleTime: 0,
    retry: 1,
    enabled: !!visible && !!selectedCompId,
  });

  const branchOptions: Option[] = useMemo(
    () =>
      branchList.map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
    [branchList]
  );

  const companyOptions: Option[] = useMemo(
    () =>
      companyList.map((s: any) => ({
        value: s.id,
        label: s.name,
      })),
    [companyList]
  );

  const yesNoTagOptions: Option[] = useMemo(
    () => yesNoTags.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const statustypeOptions: Option[] = useMemo(
    () => Statustype.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const selectedUser = useMemo(() => {
    return userList.find((u: any) => u.id === selectedUserId);
  }, [userList, selectedUserId]);

  // Submit handler
  const handleFormSubmit = async (data: userBranchMappingFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete User ",
          message: "Are you sure you want to delete this user ?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          compid: selectedCompId,
          brnchid: formDataId,
          mapuserid: selectedUserId as number,
        });
        onClose();
        return;
      }

      const payload: UserBranchMappingFormType = {
        ...data,
        mapuserid: data.mapuserid ?? 0,
        brnchid: data.brnchid ?? 0,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset({});
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formDataId,
          data: payload,

        });
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };


  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} user `}
      width="70vw"
      height="60vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* UserForm Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              User Information
            </h2>


            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">User Name </label>
                <div className="p-2 border rounded bg-gray-100">
                  {selectedUser?.name || "No user selected"}
                </div>
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Company</label>
                <FormSelect<userBranchMappingFormSchema>
                  name="compid"
                  control={control}
                  options={companyOptions}
                  placeholder="Select company"
                  isDisabled={isReadOnly}
                />
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Branch</label>
                <FormSelect<userBranchMappingFormSchema>
                  name="brnchid"
                  control={control}
                  options={branchOptions}
                  placeholder="Select branch"
                  isDisabled={isReadOnly}
                />
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">


              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Is default</label>
                <FormSelect<userBranchMappingFormSchema>
                  name="isdefault"
                  control={control}
                  options={yesNoTagOptions}
                  placeholder="Select default"
                  isDisabled={isReadOnly}
                />
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Status</label>
                <FormSelect<userBranchMappingFormSchema>
                  name="status"
                  control={control}
                  options={statustypeOptions}
                  placeholder="Select status"
                  isDisabled={isReadOnly}
                />
              </div>

            </div>
          </section>


        </div>

        {/* Footer delete-btn   */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? isDeleteMode ? "Deleting..." : "Saving..."
                : isDeleteMode ? "Delete" : "Save"
              }
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit
          </button>
        </div>

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingUser} showIndicator />
      </form>
    </Popup>
  );
}