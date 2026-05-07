
import { forwardRef, useMemo } from 'react';
import { VoucherNumbering } from '../types/vouchernumbering.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface VoucherNumberingDataGridProps {
  dataSource: VoucherNumbering[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const VoucherNumberingDataGrid = forwardRef<any, VoucherNumberingDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'prefix', caption: 'Prefix', width: 100, headerFilter: true },
      { dataField: 'suffix', caption: 'Suffix', width: 100, headerFilter: true },
      { dataField: 'lastno', caption: 'Last No.', width: 100, headerFilter: true },
      { dataField: 'maxlength', caption: 'Max Length', width: 100, headerFilter: true },
      { dataField: 'manualallow', caption: 'Manual Allow', width: 100, headerFilter: true },
      { dataField: 'futuredateallow', caption: 'Future Date Allow', width: 120, headerFilter: true },
      { dataField: 'status', caption: 'Status', width: 80, headerFilter: true },
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

VoucherNumberingDataGrid.displayName = 'voucherNumberingDataGrid';