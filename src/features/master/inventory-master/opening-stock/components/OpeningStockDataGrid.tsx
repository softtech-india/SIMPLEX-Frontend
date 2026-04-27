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
      { dataField: "pcategorynm", caption: "Category ", width: 120, headerFilter: true },
      { dataField: "productnm", caption: "productnm", width: 200, headerFilter: true },
      { dataField: "qty1", caption: "Quantity", width: 80, headerFilter: true },
      { dataField: "rate", caption: "Rate", width: 100, headerFilter: true },
      { dataField: "value", caption: "Value", width: 100, headerFilter: true },

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