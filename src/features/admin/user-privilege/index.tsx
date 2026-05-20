'use client';

import { useState, useCallback, useMemo } from "react";
import { TreeList, Editing, Column } from "devextreme-react/tree-list";
import LoadPanel from "devextreme-react/load-panel";
import SelectBox from "devextreme-react/select-box";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/store/userStore";
import { userPrivilegeService } from "./services/userPrivilegeService";
import type { UserPrivilege } from "./types/userPrivilege.types";
import { toast } from "sonner";
import InlineSelectField from "@/common/components/InlineSelectField";
import { ToolbarSelect } from "@/common/components/barmanager/ToolbarSelect";


const editableFields = [
  "isAdded",
  "isUpdated",
  "isDeleted",
  "isExported",
  "isPrinted",
  "isViewed",
  "isEmailed",
  "isApproved",
];

export default function UserPrivilegeModule() {

  const { userId } = useUserStore();
  const [loader, setLoader] = useState(false);
  const [priviledges, setPriviledges] = useState<UserPrivilege[]>([]);
  const [selecteduser, setSelectedUser] = useState<number>(0);

  const { data: userList = [], isLoading: userLoading } = useQuery({
    queryKey: ["userList", userId],
    queryFn: () => userPrivilegeService.fetchUsersListByAdmin(),
    staleTime: 0,
    retry: 1,
    enabled: !!userId,
  });

  const parentIds = useMemo(() => {

    return new Set(
      priviledges
        .filter((x) => x.parentid !== null)
        .map((x) => x.parentid)
    );

  }, [priviledges]);

  const getRoleMenuPriviledges = useCallback(async (roleId: number) => {

    try {
      setLoader(true);
      const data = await userPrivilegeService.fetchUserPrivileges(roleId);
      setPriviledges(data);

    } catch (e: any) {
      toast.error(String(e));
    } finally {
      setLoader(false);
    }

  }, []);

  const onRoleChange = useCallback((e: any) => {
    if (!e.selectedItem) return;

    const userId = e.selectedItem.id;
    setSelectedUser(userId);
    getRoleMenuPriviledges(userId);

  }, [getRoleMenuPriviledges]);

  const onSaved = useCallback(async (e: any) => {

    if (!e.changes?.length) return;
    try {

      setLoader(true);
      const list = e.changes.map((x: any) => x.data);

      const response = await userPrivilegeService.saveUserPrivileges(selecteduser, list);

      if (!response?.success) {
        throw new Error(response?.message || "Save failed");
      }

      toast.success(response?.message || "Operation successful");

    } catch (e: any) {
      toast.error(String(e));
    } finally {
      setLoader(false);
    }

  }, [selecteduser]);

  const onEditorPreparing =
    useCallback((e: any) => {

      if (e.parentType !== "dataRow" || !e.row?.data) {
        return;
      }

      const hasChildren = parentIds.has(e.row.data.formid);

      if (hasChildren && editableFields.includes(e.dataField)) {
        e.cancel = true;
      }

    }, [parentIds]);


  const onRowPrepared = useCallback((e: any) => {

    if (e.rowType !== "data") return;
    const hasChildren = parentIds.has(e.data.formid);

    if (hasChildren) { e.rowElement.style.fontWeight = "bold"; }

  }, [parentIds]);

  const userOptions = useMemo(() => {
    return userList.map((user) => ({
      label: user.name,
      value: user.id,
    }));
  }, [userList]);


  return (

    <div id="tree-list-demo">

      {/* <SelectBox
        dataSource={userList}
        displayExpr="name"
        valueExpr="id"
        width={245}
        labelMode="floating"
        label="Select User"
        searchEnabled={true}
        showClearButton={true}
        onSelectionChanged={onRoleChange}
      /> */}

      <div className="bg-white rounded-xl shadow-sm border mt-2 mb-5">
        <div className="bg-blue-900 md:bg-white border md:border-gray-200 rounded-lg shadow-sm p-1">

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-80">
              <InlineSelectField label="User List">
                <ToolbarSelect
                  value={selecteduser || null}
                  options={userOptions}
                  placeholder="Select user"
                  isDisabled={loader}
                  onChange={(opt) => {
                    const userId = opt?.value ?? 0;
                    setSelectedUser(userId);
                    if (userId) {
                      getRoleMenuPriviledges(userId);
                    }
                  }}
                  className="w-full text-sm font-medium"
                />
              </InlineSelectField>
            </div>
          </div>

          <div className="mt-5">
            <TreeList
              id="tasks"
              dataSource={priviledges}
              keyExpr="formid"
              parentIdExpr="parentid"
              columnAutoWidth
              wordWrapEnabled
              showBorders
              hoverStateEnabled
              focusedRowEnabled
              allowColumnResizing
              repaintChangesOnly
              onSaved={onSaved}
              onEditorPreparing={onEditorPreparing}
              onRowPrepared={onRowPrepared}
            >

              <Editing allowAdding={false} allowUpdating allowDeleting={false} mode="batch" />

              <Column caption="Form" dataField="formnm" minWidth={250} allowEditing={false} />
              <Column caption="Add" dataField="isAdded" />
              <Column caption="Update" dataField="isUpdated" />
              <Column caption="Delete" dataField="isDeleted" />
              <Column caption="Export" dataField="isExported" />
              <Column caption="Print" dataField="isPrinted" />
              <Column caption="View" dataField="isViewed" />
              <Column caption="Email" dataField="isEmailed" />
              <Column caption="Approve" dataField="isApproved" />

            </TreeList>
          </div>

        </div>
      </div>




      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={loader || userLoading}
        showIndicator
      />

    </div>
  );
}