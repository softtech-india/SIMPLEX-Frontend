
import { forwardRef, useMemo } from 'react';
import { Godown } from '../types/godown.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface GodownDataGridProps {
  dataSource: Godown[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const GodownDataGrid = forwardRef<any, GodownDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'addr1', caption: 'Address 1', width: 250, headerFilter: true },
      { dataField: 'addr2', caption: 'Address 2', width: 250, headerFilter: true },
      // { dataField: 'addr3', caption: 'Address 3', width: 250, headerFilter: true },
      { dataField: 'pin', caption: 'Pin', width: 100, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 140 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 160, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 140 },
      { dataField: 'updatedt', caption: 'Update Date', width: 160, dataType: 'date' },
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

GodownDataGrid.displayName = 'GodownDataGrid';