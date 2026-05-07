import React, { useEffect, useMemo, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useUser, useCreateUser, useUpdateUser, useDeleteUser } from "../hooks/userUser";
import { UserFormData, OperationMode } from "../types/user";
import { userFormSchema } from "../schemas/user.schema";
import { userDefaultValues } from "../constants/userFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { useUserForm } from "../hooks/useUserForm";
import { Usertype, StateDispalytype, BackdateEntrytype, Statustype } from "@/common/utility/data"
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { fetchUserGroupList } from "@/api/master/ledger-api";
import { useAppStorage } from "@/hooks/useAuthStorage";

interface UserFormProps {
  visible: boolean;
  onClose: () => void;
  formUserId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };

export function UserForm({ visible, onClose, formUserId, mode }: UserFormProps) {

  const { userId } = useAppStorage();
  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: userList, isLoading: isLoadingUser } = useUser(formUserId);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // const {
  //   register,
  //   handleSubmit,
  //   setFocus,
  //   reset,
  //   formState: { errors },
  // } = useForm<userFormSchema>({
  //   resolver: zodResolver(userSchema),
  //   defaultValues: userDefaultValues,
  // });

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useUserForm(userDefaultValues);

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(userDefaultValues);
      return;
    }

    if (userList) {
      reset({
        ...userList, loginid: userList.code, confirmPwd: userList.pwd
      });
    }

  }, [userList, mode, visible, reset, setFocus]);


  const { data: userGroupList = [] } = useQuery({
    queryKey: ["userGroupList", userId],
    queryFn: () => fetchUserGroupList(userId),
    staleTime: 0,
    retry: 1,
    enabled: visible,
  });

  const userTypeOptions: Option[] = useMemo(
    () => Usertype.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const stateDispalytypeOptions: Option[] = useMemo(
    () => StateDispalytype.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const backDateEntryOptions: Option[] = useMemo(
    () => BackdateEntrytype.map((s) => ({ value: s.id, label: s.name })),
    []
  );

    const statusOptions: Option[] = useMemo(
    () => Statustype.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const userGroupOptions: Option[] = useMemo(
    () =>
      userGroupList.map((s: any) => ({
        value: s.id,
        label: s.group,
      })),
    []
  );


  // Submit handler
  const handleFormSubmit = async (data: userFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete User ",
          message: "Are you sure you want to delete this user ?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(formUserId);
        onClose();
        return;
      }

      // const payload: UserFormData = {
      //   ...data,
      // };

      const { isEdit, confirmPwd, ...payload } = data as any;

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset({});
        onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formUserId,
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
      height="80vh"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">User Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter user name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Username <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("loginid")}
                  disabled={isReadOnly}
                  name="loginid"
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.loginid ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Username"
                />
                {errors.loginid && <p className="text-red-500 mt-1 text-sm">{errors.loginid.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Password <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("pwd")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.pwd ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter password"
                />
                {errors.pwd && <p className="text-red-500 mt-1 text-sm">{errors.pwd.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("confirmPwd")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.confirmPwd ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Confirm password"
                />
                {errors.confirmPwd && <p className="text-red-500 mt-1 text-sm">{errors.confirmPwd.message}</p>}
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">User Type</label>
                <FormSelect<userFormSchema>
                  name="type"
                  control={control}
                  options={userTypeOptions}
                  placeholder="Select user type"
                  isDisabled={isReadOnly}
                />
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">User Group</label>
                <FormSelect<userFormSchema>
                  name="groupid"
                  control={control}
                  options={userGroupOptions}
                  placeholder="Select user group"
                  isDisabled={isReadOnly}
                />
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">State Display</label>
                <FormSelect<userFormSchema>
                  name="statedisp"
                  control={control}
                  options={stateDispalytypeOptions}
                  placeholder="Select display type"
                  isDisabled={isReadOnly}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Back Date Entry </label>
                <FormSelect<userFormSchema>
                  name="backdtentry"
                  control={control}
                  options={backDateEntryOptions}
                  placeholder="Back Date Entry"
                  isDisabled={isReadOnly}
                />
                {errors.backdtentry && <p className="text-red-500 mt-1 text-sm">{errors.backdtentry.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Contact Number </label>
                <input
                  type="text"
                  {...register("contactno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.contactno ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Contact Number"
                />
                {errors.contactno && <p className="text-red-500 mt-1 text-sm">{errors.contactno.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email </label>
                <input
                  type="email"
                  {...register("email")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Email"
                />
                {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Remarks </label>
                <input
                  type="text"
                  {...register("remarks")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.remarks ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Remarks"
                />
                {errors.remarks && <p className="text-red-500 mt-1 text-sm">{errors.remarks.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Status </label>
                <FormSelect<userFormSchema>
                  name="status"
                  control={control}
                  options={statusOptions}
                  placeholder="Status"
                  isDisabled={isReadOnly}
                />
                {errors.status && <p className="text-red-500 mt-1 text-sm">{errors.status.message}</p>}
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