import React from "react";
import {
  DataGrid,
  Column,
  Selection,
  Scrolling,
  Paging,
  Pager,
  HeaderFilter,
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
  column?: string; //  optional now
  name?: string; //  for custom summaries
  summaryType: "sum" | "count" | "avg" | "min" | "max" | "custom";
  showInColumn?: string; //  for custom summary display
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

  // columnAutoWidth={false}
  // width="100%"
  // showBorders={true}
  // scrolling={{ mode: "standard" }}
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
}) => {
  return (
    <DataGrid
      dataSource={dataSource || []}
      keyExpr={keyExpr}
      height={height}
      width="100%"
      columnAutoWidth={false}
      rowAlternationEnabled={true}
      showBorders={true}
      showColumnLines={true}
      showRowLines={true}
      focusedRowEnabled={true}
      hoverStateEnabled={true}
      allowColumnResizing={true}
      allowColumnReordering={true}
      filterValue={filterValue ?? ""}
      disabled={disabled}
      onRowDblClick={onRowDblClick}
      onRowClick={onRowClick}
      onSelectionChanged={onSelectionChanged}
      onExporting={onExporting}
      wordWrapEnabled={true}
      remoteOperations={remoteOperations}
      selectedRowKeys={selectedRowKeys}

      className="erp-grid"
    >
      {/* Selection */}
      <Selection mode={selectionMode} />

      {/* 🔍 Filter Row */}
      {showFilterRow && <FilterRow visible />}

      {/* 🧭 Column Chooser */}
      {showColumnChooser && (
        <ColumnChooser enabled mode="select" height={400}>
          <ColumnChooserSearch enabled />
          <ColumnChooserSelection allowSelectAll selectByClick recursive />
        </ColumnChooser>
      )}

      {/* 📜 Scrolling */}
      <Scrolling mode={scrollingMode} />

      {/* 📄 Paging */}
      <Paging defaultPageSize={50} />
      <Pager
        visible
        allowedPageSizes={pagerPageSizes}
        displayMode="compact"
        showPageSizeSelector
        showInfo
        showNavigationButtons
      />

      {/* ⏳ Loading */}
      <LoadPanel enabled />

      {/* 📊 Grouping */}
      <GroupPanel visible />
      <Grouping autoExpandAll={false} />

      {/* 📌 Columns */}
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

      {/* 📊 Summary */}
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
