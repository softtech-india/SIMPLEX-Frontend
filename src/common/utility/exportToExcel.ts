import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export interface ExcelColumn {
  header: string;        // Column title
  key: string;           // Object key to map data
  width?: number;        // Optional column width
  style?: Partial<ExcelJS.Style>; // Optional cell style
}

interface ExportToExcelOptions<T> {
  data: T[];                     // Array of objects
  columns: ExcelColumn[];        // Columns configuration
  fileName?: string;             // File name (default: data.xlsx)
  sheetName?: string;            // Sheet name (default: Sheet1)
}

export const exportToExcel = async <T>({
  data,
  columns,
  fileName = "data.xlsx",
  sheetName = "Sheet1",
}: ExportToExcelOptions<T>) => {
  try {
    // Create workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Define columns with optional width and styles
    worksheet.columns = columns.map((col) => ({
      header: col.header,
      key: col.key,
      width: col.width ?? 20,
      style: col.style,
    }));

    // Add rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Optional: make header bold
    worksheet.getRow(1).font = { bold: true };

    // Auto-filter
    worksheet.autoFilter = {
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: columns.length,
      },
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save file
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  } catch (err) {
    console.error("Error exporting Excel file:", err);
  }
};