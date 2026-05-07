
import { forwardRef, useMemo } from 'react';
import { HSN } from '../types/hsn.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface HSNDataGridProps {
  dataSource: HSN[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const HSNDataGrid = forwardRef<any, HSNDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'hsn', caption: 'HSN', width: 200, headerFilter: true },
      { dataField: 'description', caption: 'Description', width: 300, headerFilter: true },
      { dataField: 'gst', caption: 'GST', width: 180, headerFilter: true },
      { dataField: 'typeDesc', caption: 'Type', width: 120, headerFilter: true },

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

HSNDataGrid.displayName = 'HSNDataGrid';