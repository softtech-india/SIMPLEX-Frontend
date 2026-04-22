import React, { useState, useCallback, useEffect, useRef } from "react";
import LoadPanel from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { useRouter } from "next/router";
import DataGrid,{Column,Scrolling,Selection,} from "devextreme-react/data-grid";
import useCompanyStore from "../../../store/useCompanyStore";
import { GetRoles } from "../../../api/admin/users/users-api";
import { GetFinancialYears } from "../../../api/account/fy-api";
import { GetCompanies } from "../../../api/organization/company-api";

// -------------------------
// Type Definitions
// -------------------------
interface Role {
  id: number;
  name: string;
}

interface FinancialYear {
  id: number;
  finYearName: string;
  findesc: string;
  finstdt: string;
  finenddt: string;
}

interface Company {
  compid: number;
  compname: string;
  compadd1?: string;
  compadd2?: string;
  brnchid?: number;
  brnchname?: string;
  finid?: number;
  findesc?: string;
  finstdt?: string;
  finenddt?: string;
}

// -------------------------
// Component
// -------------------------
const CompanySelection: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [fy, setFy] = useState<FinancialYear[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userId] = useState<string | null>(localStorage.getItem("userId"));
  const [companyId, setCompanyId] = useState<number | null>(Number(localStorage.getItem("companyId")) || null);
  const [accessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Company | null>(null);
  const router = useRouter();
  const grdList = useRef<DataGrid<Company, number>>(null);

  // -------------------------
  // API Calls
  // -------------------------
  const getRoles = useCallback(() => {
    if (!accessToken) return;
    setLoader(true);
    GetRoles(accessToken)
      .then((response: Role[]) => {
        setRoles(response);
      })
      .catch((e: unknown) => {
        console.error(e);
        notify(String(e), "error", 3000);
      })
      .finally(() => setLoader(false));
  }, [accessToken]);

  const getCompanies = useCallback(() => {
    if (!accessToken || !userId) return;
    setLoader(true);
    GetCompanies(accessToken, userId)
      .then((response: { data: Company[] }) => {
        setCompanies(response.data);
      })
      .catch((e: unknown) => {
        console.error(e);
        notify(String(e), "error", 3000);
      })
      .finally(() => setLoader(false));
  }, [accessToken, userId]);

  const getFinancialYears = useCallback(() => {
    if (!accessToken) return;
    setLoader(true);
    GetFinancialYears(accessToken)
      .then((response: FinancialYear[]) => {
        setFy(response);
      })
      .catch((e: unknown) => {
        console.error(e);
        notify(String(e), "error", 3000);
      })
      .finally(() => setLoader(false));
  }, [accessToken]);

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    getRoles();
    getCompanies();
    getFinancialYears();
  }, [getRoles, getCompanies, getFinancialYears]);

  // -------------------------
  // Event Handlers
  // -------------------------
  const onSelectionChanged = (e: any) => {
    if (e.selectedRowsData.length > 0) {
      const selected = e.selectedRowsData[0] as Company;
      setSelectedRow(selected);
      setCompanyId(selected.compid);
    }
  };

  const onSaved = async () => {
    debugger
    if (!selectedRow || !selectedRow.compid) {
      notify("Please Select a Company.", "warning", 2000);
      return;
    }

    const { setCompanyData } = useCompanyStore.getState();

    setCompanyData({
      companyId: selectedRow.compid.toString(),
      branchId: selectedRow.brnchid?.toString() ?? "",
      financialYearId: selectedRow.finid?.toString() ?? "",
      companyName: selectedRow.compname,
      branchName: selectedRow.brnchname ?? "",
      financialYearName: selectedRow.findesc ?? "",
      finYearStartDate: selectedRow.finstdt ?? "",
      finYearEndDate: selectedRow.finenddt ?? "",
    });

    // Save to localStorage
    localStorage.setItem("companyId", selectedRow.compid.toString());
    localStorage.setItem("branchId", String(selectedRow.brnchid ?? 0));
    localStorage.setItem("financialYearId", String(selectedRow.finid ?? 0));
    localStorage.setItem("companyName", selectedRow.compname);
    localStorage.setItem("branchName", selectedRow.brnchname ?? "");
    localStorage.setItem("financialYearName", selectedRow.findesc ?? "");
    localStorage.setItem("finYearStartDate", selectedRow.finstdt ?? "");
    localStorage.setItem("finYearEndDate", selectedRow.finenddt ?? "");

    router.push("/dashboard");
  };

  // -------------------------
  // JSX Render
  // -------------------------
  return (
    <>
      <DataGrid
        dataSource={companies}
        ref={grdList}
        keyExpr="brnchid"
        showBorders={true}
        selectedRowKeys={companyId ? [companyId] : []}
        focusedRowEnabled={true}
        hoverStateEnabled={true}
        allowColumnResizing={true}
        onSelectionChanged={onSelectionChanged}
      >
        <Selection mode="single" />
        <Scrolling rowRenderingMode="virtual" />
        <Column dataField="brnchid" visible={false} width={60} />
        <Column dataField="brnchname" caption="Company Name" width={350} />
        <Column dataField="brnchadd1" caption="Address 1" />
        <Column dataField="brnchadd2" caption="Address 2" />
      </DataGrid>

      <br />
      <div className="row">
        <div className="col d-flex justify-content-end">
          <Button
            icon="chevrondoubleright"
            width={100}
            type="default"
            stylingMode="contained"
            text="Proceed"
            onClick={onSaved}
          />
        </div>
      </div>

      <br />
      <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={loader} showIndicator={true} />
    </>
  );
};

export default CompanySelection;
