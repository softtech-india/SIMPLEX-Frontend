import { forwardRef } from 'react';
import { Requisition } from '../types/godowntransfer.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface RequisitionDataGridProps {
  dataSource: Requisition[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const RequisitionDataGrid = forwardRef<any, RequisitionDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      { dataField: "reqno", caption: "Requisition No.", width: 150, headerFilter: true },
      { dataField: "reqdt", caption: "Date", dataType: "date", format: "dd-MM-yyyy", width: 100 },

      { dataField: "tobranchnm", caption: "To Branch", width: 150, headerFilter: true },
      { dataField: "togodownnm", caption: "To Godown", width: 120, headerFilter: true },
      { dataField: "totqty", caption: "Total Quantity", width: 100, headerFilter: true },
      { dataField: "reqstatusdesc", caption: "Status", width: 150, headerFilter: true },
      { dataField: "rem1", caption: "Remarks", width: 200, headerFilter: true },
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
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={height}
      />
    );
  }
);

RequisitionDataGrid.displayName = 'RequisitionDataGrid';