
import { forwardRef } from 'react';
import { GoodReceivedNote } from '../types/goodReceivedNote.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';
import { AlignCenter, CheckCircle, XCircle } from 'lucide-react';

interface GoodReceivedNoteDataGridProps {
  dataSource: GoodReceivedNote[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const GoodReceivedNoteDataGrid = forwardRef<any, GoodReceivedNoteDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = [
      { dataField: "grnno", caption: "GRN No.", width: 150, headerFilter: true },
      { dataField: "isconfirm", caption: "Confirm", width: 120, headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value;

          const isConfirmed =
            value === "Confirmed" || value === "Y" || value === true;

          return (
            <div className='flex gap-2' >
              {isConfirmed ? (
                <>
                  <CheckCircle color="green" size={18} />
                  <span className='text-green-600 font-bold'> Yes </span>
                </>
              ) : (
                <>
                  <XCircle color="red" size={18} />
                  <span className='text-red-600 font-bold'> No </span>
                </>
              )}
            </div>
          );
        },
      },
      { dataField: "grndt", caption: "GRN date", dataType: "date", format: "dd-MM-yyyy", width: 120 },
      { dataField: "vendor", caption: "Vendor", width: 200, headerFilter: true },
      { dataField: "godownnm", caption: "Godownnm", width: 200, headerFilter: true },
      { dataField: "orderno", caption: "Order No.", width: 200, headerFilter: true },
      { dataField: "orderdt", caption: "Order date", dataType: "date", format: "dd-MM-yyyy", width: 120 },
      { dataField: "qty1", caption: "Quantity", width: 80, headerFilter: true },
      { dataField: "totprodval", caption: "Total Value", width: 100, headerFilter: true },
      { dataField: "narration", caption: "Narration", width: 200, headerFilter: true },
      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 150, dataType: 'date' },
      { dataField: 'updateby', caption: 'Update User', width: 120 },
      { dataField: 'updatedt', caption: 'Update Date', width: 150, dataType: 'date' },
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

GoodReceivedNoteDataGrid.displayName = 'GoodReceivedNoteDataGrid';