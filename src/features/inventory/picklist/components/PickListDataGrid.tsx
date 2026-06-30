
import { forwardRef } from 'react';
import { PickList } from '../types/pickList.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface PickListDataGridProps {
  dataSource: PickList[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const PickListDataGrid = forwardRef<any, PickListDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 500 }, ref) => {

    const columns = [ // 
      { dataField: "picklistno", caption: "Order No.", width: 150, headerFilter: true },
      { dataField: "picklistdt", caption: "Order date", dataType: "date", format: "dd-MM-yyyy", width: 120, },
      { dataField: "transportername", caption: "Transporter", width: 200, headerFilter: true },
      { dataField: "vehicleno", caption: "Vehicle No", width: 100, headerFilter: true },
      { dataField: "qty", caption: "Quantity", width: 80, headerFilter: true },
      { dataField: "narration", caption: "Narration", width: 200, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 150, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 120 },
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
        height={height}
      />
    );
  }
);

PickListDataGrid.displayName = 'PickListDataGrid';