
import { forwardRef, useMemo } from 'react';
import { ProdGroup } from '../types/prodGroup.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface ProdGroupDataGridProps {
  dataSource: ProdGroup[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const ProdGroupDataGrid = forwardRef<any, ProdGroupDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 300, headerFilter: true },
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

ProdGroupDataGrid.displayName = 'ProdGroupDataGrid';