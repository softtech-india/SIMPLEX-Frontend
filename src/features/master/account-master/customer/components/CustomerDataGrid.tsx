
import { forwardRef } from 'react';
import { Customer } from '../types/customer.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface CustomerDataGridProps {
  dataSource: Customer[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const CustomerDataGrid = forwardRef<any, CustomerDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      // Core Info
      { dataField: "code", caption: "Code", width: 110, headerFilter: true },
      { dataField: "name", caption: "Name", width: 150, headerFilter: true },
      { dataField: "subledgertypenm", caption: "Type", width: 80, headerFilter: true },
      { dataField: "ledgergroupnm", caption: "Ledger Group", width: 130, headerFilter: true },
      { dataField: "statusdesc", caption: "Status", width: 80, headerFilter: true },

      // Address Info
      { dataField: "addr", caption: "Address", width: 390 },
      { dataField: "addr1", caption: "Address 1", width: 150 },
      { dataField: "addr2", caption: "Address 2", width: 150 },
      { dataField: "addr3", caption: "Address 3", width: 150 },
      { dataField: "pin", caption: "PIN Code", width: 80 },
      { dataField: "nl", caption: "Area / Locality", width: 150 },

      // Contact Info
      { dataField: "mobile", caption: "Mobile", width: 120 },
      { dataField: "phone", caption: "Phone", width: 120 },
      { dataField: "email", caption: "Email", width: 180 },
      { dataField: "gstregtypedesc", caption: "Customer Type", width: 110 },

      // Tax Info
      { dataField: "gstin", caption: "GSTIN", width: 160, headerFilter: true },
      { dataField: "pan", caption: "PAN", width: 130, headerFilter: true },

      // Credit & Compliance
      { dataField: "crdays", caption: "Credit Days", width: 120 },
      { dataField: "crlimit", caption: "Credit Limit", width: 130 },
      { dataField: "tcsapplicable", caption: "TDS Applicable", width: 130 },

      // Audit Trail
      { dataField: "entryby", caption: "Entry By", width: 120 },
      { dataField: "entrydt", caption: "Entry Date", width: 150 },
      { dataField: "updateby", caption: "Updated By", width: 120 },
      { dataField: "updatedt", caption: "Updated Date", width: 150 },
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

CustomerDataGrid.displayName = 'CustomerDataGrid';