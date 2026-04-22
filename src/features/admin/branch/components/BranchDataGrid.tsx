
import { forwardRef, useMemo } from 'react';
import { Branch } from '../types/branch.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface BranchDataGridProps {
  dataSource: Branch[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const BranchDataGrid = forwardRef<any, BranchDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 300, headerFilter: true },
      { dataField: 'add1', caption: 'Address', width: 200, headerFilter: true },
      { dataField: 'phone', caption: 'Phone', width: 100, headerFilter: true },
      { dataField: 'email', caption: 'Email', width: 150, headerFilter: true },
      { dataField: 'gstin', caption: 'GST No', width: 120, headerFilter: true },
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

BranchDataGrid.displayName = 'BranchDataGrid';