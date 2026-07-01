
import { forwardRef } from 'react';
import { DirectSale } from '../types/directSale.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface DirectSaleDataGridProps {
  dataSource: DirectSale[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const DirectSaleDataGrid = forwardRef<any, DirectSaleDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 500 }, ref) => {

    const columns = [
      { dataField: "billno", caption: "Sale No.", width: 150, headerFilter: true },
      { dataField: "billdt", caption: "Sale Date", dataType: "date", format: "dd-MM-yyyy", width: 120, },
      { dataField: "customernm", caption: "Customer", width: 200, headerFilter: true },
      { dataField: "qty1", caption: "Quantity", width: 80, headerFilter: true },
      { dataField: "itemtval", caption: "Total Value", width: 100, headerFilter: true },
      { dataField: "billamt", caption: "Sale Amount", width: 200, headerFilter: true },

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
        height={height}
      />
    );
  }
);

DirectSaleDataGrid.displayName = 'DirectSaleDataGrid';