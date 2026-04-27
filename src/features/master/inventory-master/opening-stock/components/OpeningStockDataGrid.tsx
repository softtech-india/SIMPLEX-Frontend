import { forwardRef } from 'react';
import { OpeningStock } from '../types/openingStock';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface OpeningStockDataGridProps {
  dataSource: OpeningStock[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const OpeningStockDataGrid = forwardRef<any, OpeningStockDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      { dataField: "pcategoryid", caption: "Product Category id", width: 120, headerFilter: true },
      {
        dataField: "pcategorynm",
        caption: "Order date",
        dataType: "date",
        format: "dd-MM-yyyy",
        width: 120,
      },
      { dataField: "vendor", caption: "Vendor", width: 200, headerFilter: true },
      { dataField: "qty1", caption: "Quantity", width: 80, headerFilter: true },
      { dataField: "totprodval", caption: "Total Value", width: 100, headerFilter: true },
      { dataField: "rem1", caption: "Remarks", width: 200, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 150, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 120 },
      { dataField: 'updatedt', caption: 'Update Date', width: 120, dataType: 'date' },
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

OpeningStockDataGrid.displayName = 'OpeningStockDataGrid';