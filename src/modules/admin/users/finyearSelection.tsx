import React, { useState, useCallback, useEffect, useRef } from "react";
import LoadPanel from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { useRouter } from "next/router";
import DataGrid, {
  Column,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import { GetRoles } from "../../../api/admin/users/users-api";
import { GetFinancialYears } from "../../../api/account/fy-api";

// -----------------------------
// Type Definitions
// -----------------------------
interface Role {
  id: number;
  name: string;
}

interface FinancialYear {
  id: number;
  finId: number;
  finYearName: string;
  finYearShortName: string;
  finYearStartDate: string;
  finYearEndDate: string;
}

// -----------------------------
// Component
// -----------------------------
const FinyearSelection: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [fy, setFy] = useState<FinancialYear[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(
    Number(localStorage.getItem("companyId")) || null
  );
  const [companyName, setCompanyName] = useState<string | null>(
    localStorage.getItem("companyName")
  );
  const [financialYearId, setFinancialYearId] = useState<number | null>(
    Number(localStorage.getItem("financialYearId")) || null
  );
  const [financialYearName, setFinancialYearName] = useState<string | null>(
    localStorage.getItem("financialYearName")
  );
  const [accessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<FinancialYear | null>(null);
  const router = useRouter();
  const grdList = useRef<DataGrid<FinancialYear, number>>(null);

  // -----------------------------
  // API Calls
  // -----------------------------
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

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    getRoles();
    getFinancialYears();
  }, [getRoles, getFinancialYears]);

  // -----------------------------
  // Event Handlers
  // -----------------------------
  const onSelectionChanged = (e: any) => {
    if (e.selectedRowsData.length > 0) {
      const selected = e.selectedRowsData[0] as FinancialYear;
      setSelectedRow(selected);
      setFinancialYearId(selected.id);
    }
  };

  const onSaved = async () => {
    if (!selectedRow || !selectedRow.id) {
      notify("Please select a Fin Year.", "warning", 2000);
      return;
    }

    // Save selected financial year info in localStorage
    localStorage.setItem("financialYearId", selectedRow.finId.toString());
    localStorage.setItem("financialYearName", selectedRow.finYearShortName);
    localStorage.setItem("finYearStartDate", selectedRow.finYearStartDate);
    localStorage.setItem("finYearEndDate", selectedRow.finYearEndDate);

    router.push("/dashboard");
  };

  // -----------------------------
  // JSX Render
  // -----------------------------
  return (
    <>
      <DataGrid
        dataSource={fy}
        ref={grdList}
        keyExpr="id"
        showBorders={true}
        selectedRowKeys={financialYearId ? [financialYearId] : []}
        focusedRowKey={financialYearId ?? undefined}
        focusedRowEnabled={true}
        hoverStateEnabled={true}
        allowColumnResizing={true}
        onSelectionChanged={onSelectionChanged}
      >
        <Selection mode="single" />
        <Scrolling rowRenderingMode="virtual" />
        <Column dataField="id" width={60} visible={false} />
        <Column dataField="finYearName" caption="Fin Year" width="30%" />
        <Column
          dataField="finYearStartDate"
          caption="Start Date"
          dataType="date"
          width="20%"
          format="dd/MM/yyyy"
        />
        <Column
          dataField="finYearEndDate"
          caption="End Date"
          dataType="date"
          width="20%"
          format="dd/MM/yyyy"
        />
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
      <LoadPanel
        shadingColor="rgba(0,0,0,0.4)"
        visible={loader}
        showIndicator={true}
      />
    </>
  );
};

export default FinyearSelection;
