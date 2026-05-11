
import { forwardRef, useMemo } from 'react';
import { Transporter } from '../types/transporter';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface TransporterDataGridProps {
  dataSource: Transporter[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
  toolbarBranchId: string | null;
}

export const TransporterDataGrid = forwardRef<any, TransporterDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600, toolbarBranchId }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'mobno', caption: 'Mobile', width: 250, headerFilter: true },
      { dataField: 'phno', caption: 'Phone', width: 250, headerFilter: true },
      { dataField: 'contperson', caption: 'Contact Person', width: 250, headerFilter: true },
      { dataField: 'gstin', caption: 'GST', width: 250, headerFilter: true },
      { dataField: 'addr1', caption: 'Address line 1', width: 250, headerFilter: true },
      { dataField: 'addr2', caption: 'Address line 2', width: 250, headerFilter: true },
      { dataField: 'addr3', caption: 'Address line 3', width: 250, headerFilter: true },
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

TransporterDataGrid.displayName = 'TransporterDataGrid';