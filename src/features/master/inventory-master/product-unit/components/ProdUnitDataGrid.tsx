
import { forwardRef, useMemo } from 'react';
import { ProdUnit } from '../types/prodUnit.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface ProdUnitDataGridProps {
  dataSource: ProdUnit[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const ProdUnitDataGrid = forwardRef<any, ProdUnitDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 150, headerFilter: true },
      { dataField: 'description', caption: 'Description', width: 150, headerFilter: true },
      { dataField: 'decimalplace', caption: 'Decimalplace', width: 120, headerFilter: true },
      { dataField: 'gstunit', caption: 'GST Unit', width: 150, headerFilter: true },

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

ProdUnitDataGrid.displayName = 'ProdUnitDataGrid';