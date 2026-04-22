"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import {
  DialogMui,
  DialogHeaderMui,
  DialogTitleMui,
  DialogContentMui,
} from "./dialogMui";

import { CardContent } from "@mui/material";
import InputMui from "./inputMui/inputMui";
import CardMui from "./cardMui/cardMui";
import ButtonMui from "./buttonMui/buttonMui";

interface DemoCustomDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enableSearch?: boolean;
  enableExport?: boolean;
  height?: number;
  onRowClick?: (row: T) => void;
}

export default function DemoCustomDataGrid<T>({
  data,
  columns,
  enableSearch = true,
  enableExport = true,
  height = 400,
  onRowClick,
}: DemoCustomDataGridProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingRow, setEditingRow] = useState<T | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
  });

  const exportExcel = () => {
    const rows = table.getRowModel().rows.map((r) => r.original);
    const ws = XLSX.utils.json_to_sheet(rows as any[]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grid");
    XLSX.writeFile(wb, "grid.xlsx");
  };

  const copyCell = (value: any) => {
    navigator.clipboard.writeText(String(value));
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      {enableSearch && (
        <InputMui
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          label=""
        />
      )}

      {/* Export */}
      {enableExport && <ButtonMui onClick={exportExcel} label="Export Excel" />}

      {/* Desktop Grid */}
      <div
        className="hidden md:block border rounded-lg overflow-auto"
        style={{ height }}
      >
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="p-2 cursor-pointer"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick?.(row.original)}   // ✅ row click
                onDoubleClick={() => setEditingRow(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-2"
                    onClick={() => copyCell(cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (like MUI DataGrid) */}
      <div className="flex gap-2 items-center">
        <ButtonMui
          label="Prev"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <ButtonMui
          label="Next"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-3">
        {table.getRowModel().rows.map((row) => (
          <CardMui
            key={row.id}
            onClick={() => onRowClick?.(row.original)}
          >
            <CardContent className="space-y-2">
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    copyCell(cell.getValue());
                  }}
                >
                  <strong>{cell.column.id}:</strong>{" "}
                  {String(cell.getValue())}
                </div>
              ))}
            </CardContent>
          </CardMui>
        ))}
      </div>

      {/* Edit Modal */}
      <DialogMui
        open={!!editingRow}
        onOpenChange={() => setEditingRow(null)}
        onClose={() => console.log("Closed")}
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
