import { forwardRef } from 'react';
import { StockTrial, StockTrialFilterState } from '../types/stockTrial.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface StockTrialDataGridProps {
  dataSource: StockTrial[];
  onSelectionChanged: (e: any) => void;
  onRowDblClick: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
  localFilters: any
}

export const StockTrialDataGrid = forwardRef<any, StockTrialDataGridProps>(
  (
    {
      dataSource,
      onSelectionChanged,
      onRowDblClick,
      onExporting,
      height = 600,
      localFilters
    },
    ref
  ) => {

    const columns = [
      { dataField: "productcode", caption: "Code", width: 100, headerFilter: true },
      { dataField: "productnm", caption: "Name", width: 190, headerFilter: true },
      { dataField: "opqty", caption: "Opening", width: 100, headerFilter: true },
      { dataField: "recvqty", caption: "Received", width: 100, headerFilter: true },
      { dataField: "issuqty", caption: "Issue", width: 100, headerFilter: true },
      { dataField: "clqty", caption: "Closing", width: 100, headerFilter: true },
      { dataField: "unit", caption: "Unit", width: 100, headerFilter: true },
      { dataField: "brandnm", caption: "Brand", width: 100, headerFilter: true },
      { dataField: "classnm", caption: "Class", width: 200, headerFilter: true },
      { dataField: "subclassnm", caption: "Sub Class", width: 100, headerFilter: true }
    ];

    if (localFilters?.printrtval === 0) {
      columns.splice(6, 0,
        { dataField: "clrate", caption: "Rate", width: 100, headerFilter: true },
        { dataField: "clval", caption: "Value", width: 100, headerFilter: true }
      );
    }

    return (
      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="productid"
        showColumnChooser={true}
        onRowDblClick={onRowDblClick}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={500}
      />
    );
  }
);

StockTrialDataGrid.displayName = 'StockTrialDataGrid';