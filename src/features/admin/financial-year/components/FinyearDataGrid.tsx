
import { forwardRef, useMemo } from 'react';
import { Finyear } from '../types/finyear.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface FinyearDataGridProps {
  dataSource: Finyear[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const FinyearDataGrid = forwardRef<any, FinyearDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 500 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'findesc', caption: 'Finaancial year', width: 200, headerFilter: true },
      { dataField: 'finstdt', caption: 'Financial year start', width: 200, headerFilter: true },
      { dataField: 'finenddt', caption: 'Financial year end', width: 200, headerFilter: true },
      { dataField: 'status', caption: 'Status', width: 150, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 130, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 120 },
      { dataField: 'updatedt', caption: 'Update Date', width: 130, dataType: 'date' },
    ], []);

    return (
      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="id"
        showColumnChooser={true}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={height}  
      />
    );
  }
);

FinyearDataGrid.displayName = 'FinyearDataGrid';