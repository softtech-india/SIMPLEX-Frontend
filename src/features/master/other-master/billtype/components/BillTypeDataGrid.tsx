
import { forwardRef, useMemo } from 'react';
import { BillType } from '../types/billtype.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface BillTypeDataGridProps {
  dataSource: BillType[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const BillTypeDataGrid = forwardRef<any, BillTypeDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'typedesc', caption: 'Type', width: 250, headerFilter: true },
      // { dataField: 'addr3', caption: 'Address 3', width: 250, headerFilter: true },
      { dataField: 'accountheadnm', caption: 'Ledger Group Type', width: 100, headerFilter: true },
      { dataField: 'taxregiondesc', caption: 'Tax Region', width: 140 },
      { dataField: 'typeoftransactiondesc', caption: 'Type of Transaction', width: 160, dataType: 'date' },
      { dataField: 'taxapplicabledesc', caption: 'Tax Applicable', width: 140 },
      { dataField: 'istaxincludedesc', caption: 'Tax Include', width: 160, dataType: 'date' },
      { dataField: 'isdefaultdesc', caption: 'Default', width: 160, dataType: 'date' },
      { dataField: 'posapplicabledesc', caption: 'POS Applicable', width: 160, dataType: 'date' },
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

BillTypeDataGrid.displayName = 'BillTypeDataGrid';