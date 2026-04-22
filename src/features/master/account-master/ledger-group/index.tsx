'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import LoadPanel from "devextreme-react/load-panel";
import TreeList, {
  Column,
  Editing,
  FormItem,
  ValidationRule,
} from "devextreme-react/tree-list";
import notify from "devextreme/ui/notify";
import { useRouter } from "next/router";
import { apiCall } from "@/utils/apiClient";
import { isEmpty } from "lodash";
import DataGrid, { DataGridTypes, } from "devextreme-react/data-grid";
import { toast } from "sonner";

// ----------------- Interfaces -----------------
// ----------------- Interfaces -----------------
interface ListItem {
  compid: number | null;
  id: number | null;
  ledgergroup: string;
  underid: number | null;
  issubledger: 0 | 1;
}

interface SubledgerType {
  id: number;
  subledgerTypeName: string;
}

interface Privilege {
  path: string;
  [key: string]: any;
}

interface ListProps { }

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;


}
// ----------------- Component -----------------
export default function LedgerGroup() {

  const [listDs, setListDs] = useState<ListItem[]>([]); //LIST DATA SET DECLARATION
  const [accessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [companyId] = useState<string | null>(localStorage.getItem("companyId"));
  const [userId] = useState<string | null>(localStorage.getItem("userId"));
  const [loader, setLoader] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [openMode, setOpenMode] = useState<
    "Add" | "Edit" | "Delete" | "View" | "Print"
  >("Add");
  const [id, setId] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<ListItem | null>(null);
  const [priviledge, setPriviledge] = useState<Privilege | null>(null);
  const router = useRouter();
  const treeListRef = useRef<any>(null);
  const grdList = useRef<DataGrid<ListItem, number>>(null);
  let componentRef = useRef<HTMLDivElement>(null);

  function listsearch() {
    if (!companyId || !accessToken) return;
    setLoader(true);
    apiCall
      .get(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "ledgergroup", {
        userid: userId,
        compid: companyId,
      })
      .then((response: any) => {
        if (response?.error) {
          // notify(response.error, "error", 3000);
          toast.error(response.error);
          setLoader(false);
          return;
        }
        setListDs(response.data);
        setLoader(false);
      })
      .catch((e) => {
        console.error(e);
        // notify(String(e), "error", 3000);
        toast.error(String(e));
        setLoader(false);
      });
  }

  useEffect(() => {
    listsearch();
  }, [accessToken, isEntryModalOpen]);

  const findPrivilegesByPath = (
    privileges: Privilege[],
    path: string
  ): Privilege[] => {
    let matches: Privilege[] = [];

    for (const p of privileges) {
      if (p.path === path) {
        matches.push(p);
      }
      if (p.items && p.items.length > 0) {
        matches = matches.concat(findPrivilegesByPath(p.items, path));
      }
    }

    return matches;
  };

  useEffect(() => {
    const userPriviledgeStr = localStorage.getItem("userPriviledge");
    if (!userPriviledgeStr) return;
    const userPriviledge = JSON.parse(userPriviledgeStr);
    const itemPriviledges = userPriviledge.rawPriviledges;
    const found = findPrivilegesByPath(itemPriviledges, router.asPath.replace(/\/$/, ''));

    if (!isEmpty(found)) {
      setPriviledge(found[0]);
    }
  }, [router.asPath]);


  const isSubledgerLookup = useMemo(
    () => [
      { id: 0, text: "No" },
      { id: 1, text: "Yes" },
    ],
    []
  );

  // helpers for CRUD to update local state after API success
  const addRow = async (item: Partial<ListItem>) => {
    try {
      let response: ApiResponse | undefined;

      response = await apiCall.post(
        process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "ledgergroup",
        item,
        {
          userid: userId ?? "", compid: companyId ?? "",
        }
      );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to add ledger group");
      }

      toast.success(response?.message || "Ledger group added successfully");
      listsearch();
      return response?.data?.[0];
    } catch (error: any) {
      console.error("Add Row Error:", error);
      toast.error(error?.message || "Add failed");
      throw error;
    }
  };

  const updateRow = async (item: ListItem) => {
    try {
      let response: ApiResponse | undefined;

      response = await apiCall.put(
        process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "ledgergroup",
        item,
        {
          userid: userId ?? "", compid: companyId ?? "",
        }
      );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to update ledger group");
      }

      // ✅ Success notify
      // notify(response?.data?.[0]?.description ?? "Ledger group modified successfully", "success", 3000);
      toast.success(response?.message || "Ledger group updated successfully");


      // ✅ Reload TreeList data
      listsearch();

      // Return newly added item if needed
      return response?.data?.[0];
    } catch (e: any) {
      console.error(e);
    //  notify(e.message ?? "Update failed", "error", 3000);
      toast.error(e.message || "Update failed");
      throw e;
    }
  };

  const deleteRow = async (id: number) => {
    try {
      let response: ApiResponse | undefined;

      response = await apiCall.delete(
        process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "ledgergroup",
        {
          userid: userId,
          compid: companyId,
          id: id,
        }
      );

      if (!response?.success) {
        throw new Error(response?.message || "Failed to delete ledger group");
      }

      toast.success(response?.message || "Ledger group deleted successfully");

      // ✅ Reload TreeList data
      listsearch();

      // Return newly added item if needed
      return response?.data?.[0];
    } catch (e: any) {
      console.error(e);
      // notify(e.message ?? "Delete failed", "error", 3000);
      toast.error(e.message || "Delete failed");
      throw e;
    }
  };

  // TreeList event handlers
  // const onRowInserting = async (e: any) => {
  //   try {
  //     const payload: Partial<ListItem> = {
  //       compid: Number(companyId),
  //       ledgergroup: e.data.ledgergroup,
  //       underid: e.data.underid ?? null,
  //       issubledger: (e.data.issubledger ?? 0) as 0 | 1,
  //     };
  //     const created = await addRow(payload);
  //     e.data.id = created.id;
  //     // notify("Added", "success", 1500);
  //     toast.success("Ledger group added successfully");
  //   } catch (err: any) {
  //     // notify(err.message || "Add failed", "error", 3000);
  //     toast.error(err.message || "Add failed");
  //     e.cancel = true;
  //   }
  // };

  const onRowInserting = async (e: any) => {
  try {
    const payload: Partial<ListItem> = {
      compid: Number(companyId),
      ledgergroup: e.data.ledgergroup,
      underid: e.data.underid ?? null,
      issubledger: (e.data.issubledger ?? 0) as 0 | 1,
    };

    await addRow(payload); // no need to set e.data.id
  } catch (err: any) {
    toast.error(err.message || "Add failed");
    e.cancel = true;
  }
};

  const onRowUpdating = async (e: any) => {
    try {
      const item: ListItem = {
        compid: Number(companyId),
        id: e.key,
        ledgergroup: e.newData.ledgergroup ?? e.oldData.ledgergroup,
        underid: e.newData.underid !== undefined ? e.newData.underid : e.oldData.underid,
        issubledger: (e.newData.issubledger ?? e.oldData.issubledger) as 0 | 1,
      };
      await updateRow(item);
      // notify("Updated", "success", 1500);
     // toast.success("Ledger group updated successfully");
    } catch (err: any) {
      // notify(err.message || "Update failed", "error", 3000);
      toast.error(err.message || "Update failed");
      e.cancel = true;
    }
  };

  const onRowRemoving = async (e: any) => {
    try {
      const item = listDs.find((d) => d.id === e.key);
      if (!item) throw new Error("Item not found");
      // Prevent deleting top head
      if (item.underid === null) {
        throw new Error("Cannot delete top-head ledger group");
      }
      // Prevent deleting if has children
      const hasChildren = listDs.some((d) => d.underid === item.id);
      if (hasChildren) {
        throw new Error("This group has child groups. Delete them first.");
      }
      await deleteRow(e.key);
      // notify("Deleted", "success", 1500);
   //   toast.success("Ledger group deleted successfully");
    } catch (err: any) {
      // notify(err.message || "Delete failed", "error", 3000);
      toast.error(err.message || "Delete failed");
      e.cancel = true;
    }
  };

  // Create lookup array for Under_id (parent selector)
  const parentLookup = listDs.map((d) => ({ id: d.id, name: d.ledgergroup }));

  // ----------------- UI -----------------
  return (
    <div className="">

      <div className="rounded-xl overflow-hidden border border-gray-200">
        <TreeList
          ref={treeListRef}
          dataSource={listDs}
          keyExpr="id"
          parentIdExpr="underid"
          showBorders
          columnAutoWidth
          height={520}
          className="text-sm"
          onRowInserting={onRowInserting}
          onRowUpdating={onRowUpdating}
          onRowRemoving={onRowRemoving}
          onInitNewRow={(e) => {
            e.data.issubledger = 0; // Default “No”
          }}
          onCellPrepared={(e) => {
            const column: any = e.column;

            if (column.command === "edit") {
              if (!e.data?.underid || e.data?.underid === 0) {
                const addButton = e.cellElement.querySelector(".dx-link-add") as HTMLElement | null;
                const editButton = e.cellElement.querySelector(".dx-link-edit") as HTMLElement | null;
                const deleteButton = e.cellElement.querySelector(".dx-link-delete") as HTMLElement | null;

                if (addButton) addButton.style.display = "none";
                if (editButton) editButton.style.display = "none";
                if (deleteButton) deleteButton.style.display = "none";
              }
            }
          }}
          onEditorPreparing={(e: any) => {
            if (e.parentType === "dataRow" && e.dataField === "underid") {
              // Disable "Parent" editor while adding a new row
              if (e.row?.isNewRow) {
                e.editorOptions.disabled = true;
              }
            }
          }}
        >
          <Editing
            mode="form"
            allowAdding={true}
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
          >
            <FormItem dataField="ledgergroup" />
            <FormItem dataField="underid" />
            <FormItem dataField="issubledger" />
          </Editing>

          <Column
            dataField="ledgergroup"
            caption="Ledger Group"
            width={300}
          >
            <ValidationRule type="required" />
          </Column>
          <Column
            dataField="underid"
            caption="Parent"
            width={300}
            lookup={{
              dataSource: parentLookup,
              valueExpr: "id",
              displayExpr: "name",
            }}
          />
          <Column
            dataField="issubledger"
            caption="Is Subledger"
            width={120}
            lookup={{
              dataSource: isSubledgerLookup,
              valueExpr: "id",
              displayExpr: "text",
            }}
          >
            <ValidationRule type="required" />

          </Column>


        </TreeList>
      </div>

      <LoadPanel visible={loader} />
    </div>
  );


}