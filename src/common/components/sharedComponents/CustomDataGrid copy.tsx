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
  pagerPageSizes = [15, 30, 50, "all"],
  showFilterRow = false,
  showColumnChooser = false,
  scrollingMode = "virtual",
}) => {
  return (
    <DataGrid
      dataSource={dataSource}
      keyExpr={keyExpr}
      height={height}
      width={width}
      columnAutoWidth={columnAutoWidth}
      rowAlternationEnabled={false}
      showBorders={false}
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
      onExporting={onExporting}
      wordWrapEnabled
      remoteOperations={remoteOperations}
      selectedRowKeys={selectedRowKeys} //  Added
    >
      <Selection mode={selectionMode} />
      {showFilterRow && <FilterRow visible={true} />}
      <Scrolling mode={scrollingMode} />
      <Paging defaultPageSize={50} />
      <Pager
        visible
        allowedPageSizes={pagerPageSizes}
        displayMode="full"
        showPageSizeSelector
        showInfo
        showNavigationButtons
      />
      {/* <HeaderFilter visible /> */}
      <LoadPanel enabled />

      {/* Group panel: drag a column header to group */}
      <GroupPanel visible={false} />

      {/* Grouping settings */}
      <Grouping autoExpandAll={false} />

      {/* Dynamic Columns */}
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
        >
          {col.headerFilter && (
            <HeaderFilter allowSelectAll>
              {col.searchEnabled && <div />}{" "}
              {/* Add Search customization if needed */}
            </HeaderFilter>
          )}
        </Column>
      ))}

      {/* Dynamic Summary */}
      {(summaryItems && summaryItems.length > 0) || calculateCustomSummary ? (
        <Summary calculateCustomSummary={calculateCustomSummary}>
          {summaryItems?.map((item, index) => {
            if (item.summaryType === "custom") {
              return (
                <TotalItem
                  key={item.name || `custom-${index}`}
                  name={item.name}
                  summaryType="custom"
                  showInColumn={item.showInColumn}
                  displayFormat={item.displayFormat}
                  valueFormat={item.valueFormat}
                />
              );
            }
            return (
              <TotalItem
                key={item.column || `col-${index}`}
                column={item.column}
                summaryType={item.summaryType}
                displayFormat={item.displayFormat}
                valueFormat={item.valueFormat}
              />
            );
          })}
        </Summary>
      ) : null}

      {/* Column Chooser */}
      {showColumnChooser && (
        <ColumnChooser enabled mode="select" height={340}>
          <ColumnChooserSearch
            enabled
            editorOptions={{ placeholder: "Search column..." }}
          />
          <ColumnChooserSelection allowSelectAll selectByClick recursive />
        </ColumnChooser>
      )}

      <Export enabled={false} allowExportSelectedData={false} />
    </DataGrid>
  );
};

export default CustomDataGrid;
