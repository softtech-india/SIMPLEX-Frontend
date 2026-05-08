import { forwardRef } from 'react';
import { GodownTransfer } from '../types/godowntransfer.types';
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
      { dataField: "reqno", caption: "Requisition No.", width: 150, headerFilter: true },
      { dataField: "gtno", caption: "Godown Transfer No.", width: 150, headerFilter: true },
      { dataField: "reqdt", caption: "Req Date", dataType: "date", format: "dd-MM-yyyy", width: 100 },

      { dataField: "godownnm", caption: "From Godown", width: 150, headerFilter: true },
      { dataField: "gtdt", caption: "Transfer Date", dataType: "date", format: "dd-MM-yyyy", width: 100 },
      { dataField: "tobranchnm", caption: "To Branch", width: 150, headerFilter: true },
      { dataField: "togodownnm", caption: "To Godown", width: 120, headerFilter: true },
      { dataField: "totqty", caption: "Total Quantity", width: 100, headerFilter: true },
      { dataField: "recvstatusdesc", caption: "Status", width: 150, headerFilter: true },
      { dataField: "rem", caption: "Remarks", width: 200, headerFilter: true },
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

GodownTransferDataGrid.displayName = 'GodownTransferDataGrid';