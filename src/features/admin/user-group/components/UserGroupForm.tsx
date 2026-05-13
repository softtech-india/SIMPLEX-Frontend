import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useUserGroup, useCreateUserGroup, useUpdateUserGroup, useDeleteUserGroup } from "../hooks/userGroup";
import { UserGroupFormData, OperationMode } from "../types/userGroup.types";
import { userGroupSchema, userGroupFormSchema } from "../schemas/userGroup.schema";
import { userGroupDefaultValues } from "../constants/branchFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { useUserGroupForm } from "../hooks/userGroupForm";

interface UserGroupFormProps {
  visible: boolean;
  onClose: () => void;
  UserGroupId: number;
  mode: OperationMode;
}

export function UserGroupForm({ visible, onClose, UserGroupId, mode }: UserGroupFormProps) {

  const confirm = useConfirm();
  const defaultFocusRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: userGroupList, isLoading: isLoadingUserGroup } = useUserGroup(UserGroupId);
  const createMutation = useCreateUserGroup();
  const updateMutation = useUpdateUserGroup();
  const deleteMutation = useDeleteUserGroup();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // const {
  //   register,
  //   handleSubmit,
  //   setFocus,
  //   reset,
  //   formState: { errors },
  // } = useForm<userGroupFormSchema>({
  //   resolver: zodResolver(userGroupSchema),
  //   defaultValues: userGroupDefaultValues,
  // });

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors },
  } = useUserGroupForm(userGroupDefaultValues);

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("group");
    }, 1000);

    if (mode === 'Add') {
      reset(userGroupDefaultValues);
      return;
    }

    if (userGroupList) {
      reset({
        ...userGroupList,
      });
    }
  }, [userGroupList, mode, visible, reset, setFocus]);



  // Submit handler
  const handleFormSubmit = async (data: userGroupFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete User Group",
          message: "Are you sure you want to delete this user group?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(UserGroupId);
        onClose();
        return;
      }

      const payload: UserGroupFormData = {
        ...data,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset({});
       // onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: UserGroupId,
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
      title={`${mode} user group`}
      width="70vw"
      height="auto"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* UserGroupForm Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              User Group Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">User Group Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("group")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.group ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter user group name"
                />
                {errors.group && <p className="text-red-500 mt-1 text-sm">{errors.group.message}</p>}
              </div>


            </div>
          </section>


        </div>

        {/* Footer delete-btn */}
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingUserGroup} showIndicator />
      </form>
    </Popup>
  );
}