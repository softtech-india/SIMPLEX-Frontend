'use client';

import { Popup } from "devextreme-react/popup"; import DataGrid, {
  Column,
  Selection,
  Scrolling,
} from "devextreme-react/data-grid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";

import { fetchCompanySelectionList } from "@/api/master/ledger-api";
import { storageService } from "@/common/utility/storageService";
import useUserStore from "@/store/userStore";
import useCompanyStore from "@/store/useCompanyStore";


export default function CompanySelectionModule() {

  const { userId } = useUserStore();
  const router = useRouter();

  const [visible, setVisible] = useState(true);

  const onClose = () => {
    setVisible(false);
    router.push("/dashboard");
  };

  const { data: companySelection = [], isLoading, refetch } = useQuery({
    queryKey: ["CompanySelection", userId],
    queryFn: () => fetchCompanySelectionList(userId),

    enabled: !!userId,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",

    select: (data) =>
      (data ?? []).map((s: any) => ({
        compid: s.compid,
        compname: s.compname,
        compadd1: s.compadd1,
        compgstin: s.compgstin,
        branchid: s.branchid,
        branchnm: s.branchname,
        userid: s.userid,
        finid: s.finid,
      })),
  });


  const handleSelectCompany = (selected: any) => {
    if (!selected) return;

    storageService.setItem("companyId", selected.compid);
    storageService.setItem("companyName", selected.compname);

    // useCompanyStore.getState().setCompanyData({
    //   companyId: selected.compid,
    //   companyName: selected.compname,
    //   branchId: selected.branchid,
    //   branchName: selected.branchnm,
    // });

    useUserStore.getState().setUserData({
      companyId: selected.compid,
      companyName: selected.compname,
      branchId: selected.branchid,
      finid: selected.finid,
      branchnm: selected.branchnm,
    });

    router.push("/dashboard");
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title="Company Selection"
      width="70vw"
      height="50vh"
      dragEnabled
      showTitle
      showCloseButton
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 p-3">
          <DataGrid
            dataSource={companySelection}
            keyExpr="compid"
            showBorders
            hoverStateEnabled
            focusedRowEnabled
            columnAutoWidth
            onRowDblClick={(e: any) => handleSelectCompany(e.data)}
            onRowClick={(e: any) => {
              if (e.event?.detail === 2) return;
            }}
            height="100%"
          >
            <Selection mode="single" />
            <Scrolling mode="virtual" />

            <Column dataField="compname" caption="Company Name" />
            <Column dataField="compadd1" caption="Address" />
            <Column dataField="compgstin" caption="GSTIN" />
          </DataGrid>
        </div>

        <div className="border-t p-3 flex justify-end bg-gray-50">
          <button onClick={onClose} className="secondary-btn">
            Exit
          </button>
        </div>
      </div>
    </Popup>
  );

}