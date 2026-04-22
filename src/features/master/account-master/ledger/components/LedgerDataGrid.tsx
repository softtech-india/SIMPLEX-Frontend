
import { forwardRef } from 'react';
import { Ledger } from '../types/ledger.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface LedgerDataGridProps {
  dataSource: Ledger[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const LedgerDataGrid = forwardRef<any, LedgerDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      // Core Ledger Info
      { dataField: "ledgername", caption: "Ledger", width: 180, headerFilter: true },
      { dataField: "ledgergroupnm", caption: "Under Group", width: 150, headerFilter: true },
      { dataField: "taxnaturedesc", caption: "Tax Type", width: 120, headerFilter: true },
      { dataField: "status", caption: "Status", width: 100, headerFilter: true },

      // Financial Details
      { dataField: "ledgerpan", caption: "PAN No", width: 120, headerFilter: true },
      { dataField: "intmethoddesc", caption: "Interest Method", width: 130, headerFilter: true },
      { dataField: "intpct", caption: "Interest %", width: 90, headerFilter: true },

      // Salary Details
      { dataField: "salarydeducttype", caption: "Salary Deduct Type", width: 150, headerFilter: true },
      { dataField: "salarynarration", caption: "Salary Narration", width: 180, headerFilter: true },

      // Cost Center & Department
      { dataField: "costcenterapplicable", caption: "Cost Center?", width: 120, headerFilter: true },
      { dataField: "costcenterapplicabledesc", caption: "Department", width: 140, headerFilter: true },

      // Contact Info
      { dataField: "ledgeraddr1", caption: "Address 1", width: 180 },
      { dataField: "ledgeraddr2", caption: "Address 2", width: 180 },
      { dataField: "ledgeraddr3", caption: "Address 3", width: 180 },
      { dataField: "ledgerphone", caption: "Phone", width: 110 },
      { dataField: "ledgeremail", caption: "Email", width: 180 },
      { dataField: "ledgerwebsite", caption: "Website", width: 180 },

      // Bank & Company Info
      { dataField: "", caption: "CIN No", width: 130 },
      { dataField: "bankbranch", caption: "Bank Branch", width: 150 },
      { dataField: "", caption: "IFSC Code", width: 130 },

      // Audit Trail
      { dataField: "entryby", caption: "Entry User", width: 120 },
      { dataField: "entrydt", caption: "Entry Date", width: 130, dataType: "date" },
      { dataField: "updateby", caption: "Update User", width: 120 },
      { dataField: "updatedt", caption: "Update Date", width: 130, dataType: "date" },
    ];

    return (

      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="id"
        showColumnChooser={true}
        // onRowDblClick={handleRowDblClick}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={500}
      />
    );
  }
);

LedgerDataGrid.displayName = 'LedgerDataGrid';