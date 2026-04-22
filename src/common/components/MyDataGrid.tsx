// import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
// import { Box } from '@mui/material';

// export interface MyDataGridProps<T> {
//   rows: T[];
//   columns: GridColDef[];
//   height?: number;
//   onRowClick?: (row: T) => void;
// }

// export default function MyDataGrid<T extends { id: GridRowId }>({
//   rows,
//   columns,
//   height = 400,
//   onRowClick,
// }: MyDataGridProps<T>) {
//   return (
//     <Box sx={{ height, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSizeOptions={[10, 20]}
//         disableRowSelectionOnClick
//         onRowClick={(params) => onRowClick?.(params.row as T)}
//       />
//     </Box>
//   );
// }
// "use client";

import { useState, useMemo } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { Box, CardContent } from "@mui/material";
import * as XLSX from "xlsx";
import InputMui from "./sharedComponents/inputMui/inputMui";
import ButtonMui from "./sharedComponents/buttonMui/buttonMui";
import CardMui from "./sharedComponents/cardMui/cardMui";
import { DialogContentMui, DialogHeaderMui, DialogMui, DialogTitleMui } from "./sharedComponents/dialogMui";



export interface MyDataGridProps<T> {
  rows: T[];
  columns: GridColDef[];
  height?: number;
  onRowClick?: (row: T) => void;
  enableSearch?: boolean;
  enableExport?: boolean;
}

export default function MyDataGrid<T extends { id: GridRowId }>({
  rows,
  columns,
  height = 400,
  onRowClick,
  enableSearch = true,
  enableExport = true,
}: MyDataGridProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [editingRow, setEditingRow] = useState<T | null>(null);

  /*  Global search */
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;

    return rows.filter((row: any) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [rows, searchText]);

  /*  Export to Excel */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRows as any[]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grid");
    XLSX.writeFile(wb, "grid.xlsx");
  };

  /*  Copy cell */
  const copyCell = (value: any) => {
    navigator.clipboard.writeText(String(value));
  };

  return (
    <div className="p-1 space-y-1">
      {/*  Search */}
      {enableSearch && (
        <InputMui
          placeholder="Search..."
          value={searchText}
          onChange={(e:any) => setSearchText(e.target.value)}
          label=""
        />
      )}

      {/*  Export */}
      {enableExport && <ButtonMui label="Export Excel" onClick={exportExcel} />}

      {/*  Desktop Grid */}
      <Box
        sx={{ height, width: "100%" }}
        className="hidden md:block"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[10, 20]}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            onRowClick?.(params.row as T);
           //setEditingRow(params.row as T);
          }}
          onCellClick={(params) => copyCell(params.value)}
        />
      </Box>

      {/*  Edit Modal */}
      <DialogMui
        open={!!editingRow}
        onOpenChange={() => setEditingRow(null)}
        onClose={() => setEditingRow(null)}
      >
        <DialogHeaderMui>
          <DialogTitleMui>Edit Row</DialogTitleMui>
        </DialogHeaderMui>
        <DialogContentMui>
          {editingRow && (
            <pre className="text-sm bg-gray-100 p-2 rounded">
              {JSON.stringify(editingRow, null, 2)}
            </pre>
          )}
        </DialogContentMui>
      </DialogMui>
    </div>
  );
}

