import { forwardRef } from 'react';
import { SaleRegister } from '../types/saleRegister.type';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface SaleRegisterDataGridProps {
  dataSource: SaleRegister[];
  onSelectionChanged: (e: any) => void;
  onRowDblClick: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
  localFilters: any;
}

export const SaleRegisterDataGrid = forwardRef<any, SaleRegisterDataGridProps>(
  (
    {
      dataSource,
      onSelectionChanged,
      onRowDblClick,
      onExporting,
      height = 600,
      localFilters
    },
    ref
  ) => {

    // 1. Check if the response contains product data
    const isWithProduct = dataSource && dataSource.length > 0 && 'productnm' in dataSource[0];

    // 2. Safely check for the API typo bypassing TS strict mode (Fix for TS2551)
    const firstRow = dataSource?.[0] as any;
    const taxableField = firstRow?.taxablemat !== undefined ? "taxablemat" : "taxableamt";

    // 3. Base columns
    const columns = [
      { dataField: "billdt", caption: "Bill Date", width: 110, headerFilter: true },
      { dataField: "billno", caption: "Bill No", width: 160, headerFilter: true },
      { dataField: "trtype", caption: "Tr. Type", width: 90, headerFilter: true },
      { dataField: "partynm", caption: "Party Name", width: 180, headerFilter: true },
      { dataField: "partymobno", caption: "Mobile", width: 120, headerFilter: true },
      { dataField: "sm", caption: "Salesman", width: 120, headerFilter: true },
    ];

    // 4. Conditionally inject Product columns
    if (isWithProduct) {
      columns.push(
        { dataField: "productnm", caption: "Product", width: 250, headerFilter: true },
        { dataField: "qty", caption: "Qty", width: 80, headerFilter: true },
        { dataField: "unitnm", caption: "Unit", width: 80, headerFilter: true },
        { dataField: "rate", caption: "Rate", width: 100, headerFilter: true },
        { dataField: "pqtyrateval", caption: "Prod Value", width: 120, headerFilter: true },
        { dataField: "ptaxableval", caption: "Taxable Val", width: 120, headerFilter: true },
        { dataField: "brandnm", caption: "Brand", width: 120, headerFilter: true },
        { dataField: "classnm", caption: "Class", width: 150, headerFilter: true },
        { dataField: "groupnm", caption: "Sub Class", width: 120, headerFilter: true }
      );
    }

    // 5. Financial totals
    columns.push(
      { dataField: "netval", caption: "Net Value", width: 110, headerFilter: true },
      { dataField: "beftaxtotal", caption: "Before Tax", width: 110, headerFilter: true },
      { dataField: taxableField, caption: "Taxable Amt", width: 110, headerFilter: true },
      { dataField: "taxval", caption: "Tax Amt", width: 100, headerFilter: true },
      { dataField: "amtwithtax", caption: "Amt With Tax", width: 120, headerFilter: true },
      { dataField: "afttaxtotal", caption: "After Tax", width: 110, headerFilter: true },
      { dataField: "billamt", caption: "Bill Amt", width: 110, headerFilter: true }
    );

    return (
      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="id"
        showColumnChooser={true}
        onRowDblClick={onRowDblClick}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={500}
      />
    );
  }
);

SaleRegisterDataGrid.displayName = 'SaleRegisterDataGrid';