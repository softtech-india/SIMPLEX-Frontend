
import { forwardRef, useMemo } from 'react';
import { SalesMan } from '../types/salesman';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface SalesManDataGridProps {
  dataSource: SalesMan[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
  toolbarBranchId: string | null;
}

export const SalesManDataGrid = forwardRef<any, SalesManDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600, toolbarBranchId }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'mobno', caption: 'Mobile', width: 250, headerFilter: true },
      { dataField: 'branchnm', caption: 'Branch Name', width: 160, dataType: 'date' },
      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 150, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 120 },
      { dataField: 'updatedt', caption: 'Update Date', width: 120, dataType: 'date' },

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

SalesManDataGrid.displayName = 'SalesManDataGrid';