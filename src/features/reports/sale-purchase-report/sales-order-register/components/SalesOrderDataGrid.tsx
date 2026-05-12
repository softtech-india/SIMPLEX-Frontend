// src/features/reports/sale-purchase-report/sales-order-register/components/SalesOrderDataGrid.tsx

import React, { useEffect, forwardRef } from 'react';
import { SalesOrder } from '../types/salesOrder.type';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface SalesOrderDataGridProps {
  dataSource: SalesOrder[];
  onSelectionChanged: (e: any) => void;
  onRowDblClick: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
  localFilters?: any;
}

export const SalesOrderDataGrid = forwardRef<any, SalesOrderDataGridProps>(
  (
    {
      dataSource,
      onSelectionChanged,
      onRowDblClick,
      onExporting,
      height = 600,
      localFilters,
    },
    ref
  ) => {

    // Apply row styling after data is loaded using MutationObserver
    useEffect(() => {
      if (!dataSource || !dataSource.length) return;

      // Function to style rows
      const styleRows = () => {
        const rows = document.querySelectorAll('.dx-data-row');
        rows.forEach((row: any) => {
          // Check if row already has styling
          if (row.hasAttribute('data-styled')) return;

          // Find the customer name cell to identify row type
          const customerCell = row.querySelector('td[aria-colindex="3"]');
          if (customerCell) {
            const customerText = customerCell.textContent || '';
            if (customerText === 'GRAND TOTAL') {
              row.classList.add('grand-total-row');
              row.setAttribute('data-styled', 'true');
            } else if (customerText === 'SUB TOTAL') {
              row.classList.add('sub-total-row');
              row.setAttribute('data-styled', 'true');
            }
          }
        });
      };

      // Initial styling
      const timer = setTimeout(styleRows, 200);

      // Set up MutationObserver to watch for DOM changes
      const observer = new MutationObserver(() => {
        styleRows();
      });

      // Start observing
      const gridContainer = document.querySelector('.dx-datagrid');
      if (gridContainer) {
        observer.observe(gridContainer, { childList: true, subtree: true });
      }

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }, [dataSource]);

    const columns = [
      {
        dataField: "orderdt",
        caption: "Order Date",
        width: 90,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Grand Total' || data.data.brandnm === 'Sub Total') {
            return <span></span>;
          }
          if (data.value && data.value !== '1900-01-01T00:00:00') {
            return <span>{new Date(data.value).toLocaleDateString()}</span>;
          }
          return <span></span>;
        }
      },
      {
        dataField: "orderno",
        caption: "Order No",
        width: 160,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "customernm",
        caption: "Customer Name",
        width: 200,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total') {
            return <span className="sub-total-text">SUB TOTAL</span>;
          }
          if (data.data.brandnm === 'Grand Total') {
            return <span className="grand-total-text">GRAND TOTAL</span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "brandnm",
        caption: "Brand",
        width: 130,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "productnm",
        caption: "Product",
        width: 250,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "unitnm",
        caption: "Unit",
        width: 70,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "orderqty",
        caption: "Order Qty",
        width: 70,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? data.value.toFixed(2) : '0.00';
          if (data.data.brandnm === 'Grand Total') {
            return <span className="grand-total-qty">{value}</span>;
          }
          if (data.data.brandnm === 'Sub Total') {
            return <span className="sub-total-qty">{value}</span>;
          }
          return <span>{value}</span>;
        }
      },
      {
        dataField: "saleqty",
        caption: "Sale Qty",
        width: 70,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? data.value.toFixed(2) : '0.00';
          if (data.data.brandnm === 'Grand Total') {
            return <span className="grand-total-qty">{value}</span>;
          }
          if (data.data.brandnm === 'Sub Total') {
            return <span className="sub-total-qty">{value}</span>;
          }
          return <span>{value}</span>;
        }
      },
      {
        dataField: "balanceqty",
        caption: "Balance Qty",
        width: 70,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? data.value.toFixed(2) : '0.00';
          if (data.data.brandnm === 'Grand Total') {
            return <span className="grand-total-qty">{value}</span>;
          }
          if (data.data.brandnm === 'Sub Total') {
            return <span className="sub-total-qty">{value}</span>;
          }
          return <span>{value}</span>;
        }
      },
      {
        dataField: "classnm",
        caption: "Class",
        width: 190,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "subclassnm",
        caption: "Sub Class",
        width: 90,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.brandnm === 'Sub Total' || data.data.brandnm === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
    ];

    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>


        <CustomDataGrid
          dataSource={dataSource}
          columns={columns}
          keyExpr="id"
          showColumnChooser={true}
          onRowDblClick={onRowDblClick}
          onSelectionChanged={onSelectionChanged}
          onExporting={onExporting}
          selectionMode="single"
          height={height}
          scrollingMode="standard"
        />
      </div>
    );
  }
);

SalesOrderDataGrid.displayName = 'SalesOrderDataGrid';