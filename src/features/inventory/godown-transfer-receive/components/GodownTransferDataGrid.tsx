import { forwardRef } from 'react';
import { GodownTransfer } from '../types/godownTransferReceive.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface GodownTransferDataGridProps {
  dataSource: GodownTransfer[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const GodownTransferDataGrid = forwardRef<any, GodownTransferDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [

      { dataField: "gtno", caption: "Transfer No.", width: 150, headerFilter: true },
      { dataField: "gtdt", caption: "Date", dataType: "date", format: "dd-MM-yyyy", width: 100 },
      { dataField: "frombranchnm", caption: "From Branch", width: 150, headerFilter: true },
      { dataField: "fromgodownnm", caption: "From Godown", width: 150, headerFilter: true },
      { dataField: "reqno", caption: "Requisition No.", width: 150, headerFilter: true },
      { dataField: "reqdt", caption: "Requisition Date", dataType: "date", format: "dd-MM-yyyy", width: 100 },
      { dataField: "totqty", caption: "Total Qty", width: 70, headerFilter: true },
      { dataField: "totval", caption: "Total Value", width: 90, headerFilter: true },
      { dataField: "recvstatusdesc", caption: "Receive Status", width: 110, headerFilter: true },
      { dataField: "rem", caption: "Remarks", width: 200, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 140 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 160 },
      { dataField: 'updateby', caption: 'Update User', width: 140 },
      { dataField: 'updatedt', caption: 'Update Date', width: 160 },
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

GodownTransferDataGrid.displayName = 'GodownTransferDataGrid';