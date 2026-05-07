
import { forwardRef } from 'react';
import { Vendor } from '../types/vendor.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface VendorDataGridProps {
  dataSource: Vendor[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const VendorDataGrid = forwardRef<any, VendorDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      // Core Info
      { dataField: "code", caption: "Code", width: 120, headerFilter: true },
      { dataField: "name", caption: "Name", width: 220, headerFilter: true },
      { dataField: "subledgertypenm", caption: "Type", width: 130, headerFilter: true },
      { dataField: "ledgergroupnm", caption: "Ledger Group", width: 160, headerFilter: true },
      
      // Address Info
      { dataField: "addr", caption: "Address", width: 200 },
      { dataField: "pin", caption: "PIN Code", width: 80 },
      { dataField: "nl", caption: "Near Location", width: 150 },

      // Contact Info
      { dataField: "mobile", caption: "Mobile", width: 120 },
      { dataField: "phone", caption: "Phone", width: 120 },
      { dataField: "email", caption: "Email", width: 180 },

      // Tax Info
      { dataField: "gstin", caption: "GSTIN", width: 160, headerFilter: true },
      { dataField: "gstregtypedesc", caption: "GST Type", width: 130, headerFilter: true },
      { dataField: "pan", caption: "PAN", width: 130, headerFilter: true },

      { dataField: "status", caption: "Status", width: 100, headerFilter: true },

      // Credit & Compliance
      { dataField: "crdays", caption: "Credit Days", width: 120 },
      { dataField: "crlimit", caption: "Credit Limit", width: 130 },
      { dataField: "tdsapplicable", caption: "TDS Applicable", width: 130, headerFilter: true },
      { dataField: "deducteetype", caption: "Deductee Type", width: 130 },
      { dataField: "tdssecid", caption: "TDS Section", width: 120 },

      // Bank Details
      { dataField: "banknm", caption: "Bank Name", width: 150 },
      { dataField: "bankbranch", caption: "Branch", width: 150 },
      { dataField: "bankifsc", caption: "IFSC", width: 130 },
      { dataField: "bankaccno", caption: "Account No", width: 160 },

      // Interest
      { dataField: "intmethod", caption: "Interest Method", width: 130, headerFilter: true },
      { dataField: "intpct", caption: "Interest %", width: 100 },

      // Posting Ledger
      { dataField: "postingledgernm", caption: "Posting Ledger", width: 200 },

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

VendorDataGrid.displayName = 'VendorDataGrid';