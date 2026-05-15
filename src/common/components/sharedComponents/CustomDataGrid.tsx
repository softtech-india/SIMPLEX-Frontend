import React from "react";

import {
  DataGrid,
  Column,
  Selection,
  Scrolling,
  Paging,
  Pager,
  LoadPanel,
  Summary,
  TotalItem,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  FilterRow,
  Export,
  GroupPanel,
  Grouping,
} from "devextreme-react/data-grid";

import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";

import { exportDataGrid as exportDataGridToExcel } from "devextreme/excel_exporter";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";

import ExcelJS from "exceljs";
import saveAs from "file-saver";
import jsPDF from "jspdf";

export interface GridColumn {
  dataField: string;
  caption?: string;
  width?: string | number;
  alignment?: "left" | "center" | "right";
  dataType?: string;
  format?: string;
  headerFilter?: boolean;
  searchEnabled?: boolean;
  cellRender?: (cellData: any) => React.ReactNode;
  [key: string]: any;
}

export interface GridSummaryItem {
  column?: string;
  name?: string;
  summaryType: "sum" | "count" | "avg" | "min" | "max" | "custom";
  showInColumn?: string;
  displayFormat?: string;
  valueFormat?: { type: string; precision: number };
}

interface CustomDataGridProps {
  dataSource: CustomStore<any, any> | DataSource<any, any> | any[];
  columns: GridColumn[];
  keyExpr: string;

  height?: number | string;
  width?: number | string;

  showBorders?: boolean;
  focusedRowEnabled?: boolean;
  hoverStateEnabled?: boolean;

  allowColumnResizing?: boolean;
  columnAutoWidth?: boolean;

  filterValue?: string | null;
  disabled?: boolean;

  summaryItems?: GridSummaryItem[];
  calculateCustomSummary?: (options: any) => void;

  onRowDblClick?: (e: any) => void;
  onRowClick?: (e: any) => void;
  onSelectionChanged?: (e: any) => void;
  onExporting?: (e: any) => void;

  remoteOperations?: boolean;

  selectionMode?: "single" | "multiple" | "none";
  selectedRowKeys?: any[];

  pagerPageSizes?: (number | "all")[];

  showFilterRow?: boolean;
  showColumnChooser?: boolean;

  scrollingMode?: "standard" | "virtual" | "infinite";

  enableExport?: boolean;
  exportFormats?: ("xlsx" | "pdf")[];
  exportFileName?: string;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  dataSource,
  columns,
  keyExpr,

  height = "100%",
  width = "100%",

  showBorders = true,
  focusedRowEnabled = true,
  hoverStateEnabled = true,

  allowColumnResizing = true,
  columnAutoWidth = false,

  filterValue,
  disabled = false,

  summaryItems,
  calculateCustomSummary,

  onRowDblClick,
  onRowClick,
  onSelectionChanged,
  onExporting,
  remoteOperations = false,

  selectionMode = "single",
  selectedRowKeys = [],

  pagerPageSizes = [15, 30, 50, 100, 150, "all"],

  showFilterRow = false,
  showColumnChooser = false,

  scrollingMode = "virtual",

  enableExport = true,
  exportFormats = ["xlsx"],
  exportFileName = "DataGrid",
}) => {

  const handleExporting = async (e: any) => {

    // if (e.format === "xlsx") {
    //   const workbook = new ExcelJS.Workbook();

    //   const worksheet = workbook.addWorksheet("Sheet1");

    //   await exportDataGridToExcel({
    //     component: e.component,
    //     worksheet,
    //     autoFilterEnabled: true,
    //   });

    //   const buffer = await workbook.xlsx.writeBuffer();

    //   saveAs(
    //     new Blob([buffer], {
    //       type: "application/octet-stream",
    //     }),
    //     `${exportFileName}.xlsx`
    //   );
    // }

    if (e.format === "xlsx") {
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Sheet1");

      await exportDataGridToExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,

        customizeCell: ({ gridCell, excelCell }) => {
          if (!gridCell) return;
          // =========================
          // HEADER STYLE
          // =========================
          if (gridCell.rowType === "header") {
            excelCell.font = {
              bold: true,
              color: { argb: "FFFFFF" },
              size: 11,
            };

            excelCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "4472C4" },
            };

            excelCell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };

            excelCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }

          // =========================
          // DATA ROW STYLE
          // =========================
          if (gridCell.rowType === "data") {
            excelCell.font = {
              size: 10,
            };

            excelCell.alignment = {
              vertical: "middle",
            };

            excelCell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // Alternate row color
            if (gridCell.rowType === "data") {
              excelCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F5F5F5" },
              };
            }
          }

          // =========================
          // SUMMARY ROW STYLE
          // =========================
          if (gridCell.rowType === "totalFooter") {
            excelCell.font = {
              bold: true,
              color: { argb: "000000" },
            };

            excelCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "D9EAD3" },
            };
          }

          // =========================
          // NUMBER FORMAT
          // =========================
          if (gridCell.column?.dataType === "number") {
            excelCell.numFmt = "#,##0.00";
          }

          // =========================
          // DATE FORMAT
          // =========================
          if (gridCell.column?.dataType === "date") {
            excelCell.numFmt = "dd-MMM-yyyy";
          }
        },
      });

      // Auto width
      worksheet.columns.forEach((column: any) => {
        column.width = 20;
      });

      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer], {
          type: "application/octet-stream",
        }),
        `${exportFileName}.xlsx`
      );
    }

    // if (e.format === "pdf") {
    //   const doc = new jsPDF();

    //   await exportDataGridToPdf({
    //     jsPDFDocument: doc,
    //     component: e.component,
    //   });

    //   doc.save(`${exportFileName}.pdf`);
    // }

    if (e.format === "pdf") {
      // =========================
      // CREATE PDF DOCUMENT
      // =========================
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // =========================
      // TITLE
      // =========================
      doc.setFontSize(16);

      doc.text(exportFileName, 14, 15);

      // =========================
      // EXPORT DATE
      // =========================
      doc.setFontSize(9);

      doc.text(
        `Exported: ${new Date().toLocaleString()}`,
        14,
        22
      );

      // =========================
      // ROW COUNTER
      // =========================
      let pdfRowIndex = 0;

      // =========================
      // EXPORT GRID
      // =========================
      await exportDataGridToPdf({
        jsPDFDocument: doc,

        component: e.component,

        topLeft: { x: 10, y: 30 },

        customizeCell: ({ gridCell, pdfCell }) => {
          if (!gridCell || !pdfCell) return;

          // =========================
          // HEADER
          // =========================
          if (gridCell.rowType === "header") {
            pdfCell.backgroundColor = "#4472C4";

            pdfCell.textColor = "#FFFFFF";

            pdfCell.font = {
              size: 10,
              style: "bold",
            };

            pdfCell.horizontalAlign = "center";
          }

          // =========================
          // DATA ROWS
          // =========================
          if (gridCell.rowType === "data") {
            pdfRowIndex++;

            pdfCell.font = {
              size: 9,
            };

            pdfCell.padding = {
              top: 2,
              right: 2,
              bottom: 2,
              left: 2,
            };

            // Alternate Row Color
            if (pdfRowIndex % 2 === 0) {
              pdfCell.backgroundColor = "#F5F5F5";
            }

            // Right Align Numbers
            if (gridCell.column?.dataType === "number") {
              pdfCell.horizontalAlign = "right";
            }

            // Center Align Dates
            if (gridCell.column?.dataType === "date") {
              pdfCell.horizontalAlign = "center";
            }
          }

          // =========================
          // TOTAL FOOTER
          // =========================
          if (gridCell.rowType === "totalFooter") {
            pdfCell.backgroundColor = "#D9EAD3";

            pdfCell.font = {
              size: 10,
              style: "bold",
            };
          }
        },
      });

      // =========================
      // PAGE NUMBERS
      // =========================
      const pageCount = doc.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setFontSize(8);

        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 35,
          doc.internal.pageSize.height - 10
        );
      }

      // =========================
      // SAVE PDF
      // =========================
      doc.save(`${exportFileName}.pdf`);
    }
    e.cancel = true;
  };

  return (
    <DataGrid
      dataSource={dataSource || []}
      keyExpr={keyExpr}
      height={height}
      width={width}
      columnAutoWidth={columnAutoWidth}
      rowAlternationEnabled={true}
      showBorders={showBorders}
      showColumnLines={true}
      showRowLines={true}
      focusedRowEnabled={focusedRowEnabled}
      hoverStateEnabled={hoverStateEnabled}
      allowColumnResizing={allowColumnResizing}
      allowColumnReordering={true}
      filterValue={filterValue ?? ""}
      disabled={disabled}
      onRowDblClick={onRowDblClick}
      onRowClick={onRowClick}
      onSelectionChanged={onSelectionChanged}
      onExporting={handleExporting || onExporting}
      // onExporting={onExporting}
      wordWrapEnabled={true}
      remoteOperations={remoteOperations}
      selectedRowKeys={selectedRowKeys}
      className="erp-grid"
    >
      {/* Export */}
      <Export
        enabled={enableExport}
        formats={exportFormats}
        allowExportSelectedData={true}
      />

      {/* Selection */}
      <Selection mode={selectionMode} />

      {/* Filter Row */}
      {showFilterRow && <FilterRow visible />}

      {/* Column Chooser */}
      {showColumnChooser && (
        <ColumnChooser enabled mode="select" height={400}>
          <ColumnChooserSearch enabled />
          <ColumnChooserSelection
            allowSelectAll
            selectByClick
            recursive
          />
        </ColumnChooser>
      )}

      {/* Scrolling */}
      <Scrolling mode={scrollingMode} />

      {/* Paging */}
      <Paging defaultPageSize={50} />

      <Pager
        visible
        allowedPageSizes={pagerPageSizes}
        displayMode="compact"
        showPageSizeSelector
        showInfo
        showNavigationButtons
      />

      {/* Loading */}
      <LoadPanel enabled />

      {/* Grouping */}
      <GroupPanel visible />

      <Grouping autoExpandAll={false} />

      {/* Columns */}
      {columns.map((col) => (
        <Column
          key={col.dataField}
          dataField={col.dataField}
          caption={col.caption}
          width={col.width}
          alignment={col.alignment}
          dataType={col.dataType as any}
          format={col.format}
          cellRender={col.cellRender}
        />
      ))}

      {/* Summary */}
      {summaryItems && (
        <Summary calculateCustomSummary={calculateCustomSummary}>
          {summaryItems.map((item, index) => (
            <TotalItem
              key={index}
              column={item.column}
              summaryType={item.summaryType}
              displayFormat={item.displayFormat}
            />
          ))}
        </Summary>
      )}
    </DataGrid>
  );
};

export default CustomDataGrid;