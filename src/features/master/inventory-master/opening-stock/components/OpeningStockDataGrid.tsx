import { forwardRef } from 'react';
import { OpeningStock } from '../types/openingStock.types';
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
      { dataField: "pcategorynm", caption: "Brand", width: 150, headerFilter: true },
      { dataField: "productnm", caption: "Product Name", width: 350, headerFilter: true },
      { dataField: "qty1", caption: "Quantity", width: 90, headerFilter: true },
      { dataField: "rate", caption: "Rate", width: 100, headerFilter: true },
      { dataField: "value", caption: "Value", width: 120, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 140 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 160, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 140 },
      { dataField: 'updatedt', caption: 'Update Date', width: 160, dataType: 'date' },
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