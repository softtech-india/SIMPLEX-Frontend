
import { forwardRef } from 'react';
import { Company } from '../types/company.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface CompanyDataGridProps {
  dataSource: Company[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const CompanyDataGrid = forwardRef<any, CompanyDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      { dataField: 'name', caption: 'Name', width: 150, headerFilter: true },
      { dataField: 'add1', caption: 'Address', width: 300, headerFilter: true },
      { dataField: 'phone', caption: 'Phone', width: 100, headerFilter: true },
      { dataField: 'email', caption: 'Email', width: 100, headerFilter: true },
      { dataField: 'gstin', caption: 'GST No', width: 100, headerFilter: true },
      { dataField: 'cin', caption: 'CIN No', width: 100, headerFilter: true },
      { dataField: 'pan', caption: 'PAN No', width: 100, headerFilter: true },
      { dataField: 'tan', caption: 'TAN No', width: 100, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 80 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 120, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 80 },
      { dataField: 'updatedt', caption: 'Update Date', width: 120, dataType: 'date' },
    ];

    return (

      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="id"
        showColumnChooser={true}
        // onRowDblClick={handleRowDblClick}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={500}
      />
    );
  }
);

CompanyDataGrid.displayName = 'CompanyDataGrid';