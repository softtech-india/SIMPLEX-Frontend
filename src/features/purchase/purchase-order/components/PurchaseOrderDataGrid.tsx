
import { forwardRef } from 'react';
import { PurchaseOrder } from '../types/purchaseOrder.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface PurchaseOrderDataGridProps {
  dataSource: PurchaseOrder[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const PurchaseOrderDataGrid = forwardRef<any, PurchaseOrderDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      // Core Ledger Info
      { dataField: "orderno", caption: "Order No.", width: 180, headerFilter: true },
      { dataField: "vendor", caption: "Vendor", width: 150, headerFilter: true },
      { dataField: "qty1", caption: "qty1", width: 120, headerFilter: true },
      { dataField: "totprodval", caption: "totprodval", width: 100, headerFilter: true },

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

PurchaseOrderDataGrid.displayName = 'PurchaseOrderDataGrid';