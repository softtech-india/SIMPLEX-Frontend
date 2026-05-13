import React, { useEffect, forwardRef } from 'react';
import { GRN } from '../types/grnRegister.type';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface GRNDataGridProps {
  dataSource: GRN[];
  onSelectionChanged: (e: any) => void;
  onRowDblClick: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const GRNDataGrid = forwardRef<any, GRNDataGridProps>(
  (
    {
      dataSource,
      onSelectionChanged,
      onRowDblClick,
      onExporting,
      height = 600,
    },
    ref
  ) => {
    useEffect(() => {
      if (!dataSource || !dataSource.length) return;

      const styleRows = () => {
        const rows = document.querySelectorAll('.dx-data-row');
        rows.forEach((row: any) => {
          if (row.hasAttribute('data-styled')) return;

          const vendorCell = row.querySelector('td[aria-colindex="3"]');
          if (vendorCell) {
            const vendorText = vendorCell.textContent || '';
            if (vendorText === 'GRAND TOTAL') {
              row.classList.add('grand-total-row');
              row.setAttribute('data-styled', 'true');
            } else if (vendorText === 'SUB TOTAL') {
              row.classList.add('sub-total-row');
              row.setAttribute('data-styled', 'true');
            }
          }
        });
      };

      const timer = setTimeout(styleRows, 200);

      const observer = new MutationObserver(() => {
        styleRows();
      });

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
        dataField: "grndt",
        caption: "GRN Date",
        width: 80,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          if (data.value && data.value !== '1900-01-01T00:00:00') {
            return <span>{new Date(data.value).toLocaleDateString()}</span>;
          }
          return <span></span>;
        }
      },
      {
        dataField: "grnno",
        caption: "GRN No",
        width: 160,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "vendornm",
        caption: "Vendor Name",
        width: 200,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total') {
            return <span className="sub-total-text">SUB TOTAL</span>;
          }
          if (data.data.partyrefno === 'Grand Total') {
            return <span className="grand-total-text">GRAND TOTAL</span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "partyrefno",
        caption: "Party Ref No",
        width: 110,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "partyrefdt",
        caption: "Party Ref Date",
        width: 80,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          if (data.value && data.value !== '1900-01-01T00:00:00') {
            return <span>{new Date(data.value).toLocaleDateString()}</span>;
          }
          return <span></span>;
        }
      },
      {
        dataField: "brandnm",
        caption: "Brand",
        width: 120,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "productnm",
        caption: "Product",
        width: 220,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "unitnm",
        caption: "Unit",
        width: 60,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "qty",
        caption: "Quantity",
        width: 70,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? Number(data.value).toFixed(2) : '0.00';
          if (data.data.partyrefno === 'Grand Total') {
            return <span className="grand-total-qty">{value}</span>;
          }
          if (data.data.partyrefno === 'Sub Total') {
            return <span className="sub-total-qty">{value}</span>;
          }
          return <span>{value}</span>;
        }
      },
      {
        dataField: "rate",
        caption: "Rate",
        width: 60,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? Number(data.value).toFixed(2) : '0.00';
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{value}</span>;
        }
      },
      {
        dataField: "value",
        caption: "Value",
        width: 110,
        headerFilter: true,
        cellRender: (data: any) => {
          const value = data.value !== undefined && data.value !== null ? Number(data.value).toFixed(2) : '0.00';
          if (data.data.partyrefno === 'Grand Total') {
            return <span className="grand-total-value">{value}</span>;
          }
          if (data.data.partyrefno === 'Sub Total') {
            return <span className="sub-total-value">{value}</span>;
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
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
      {
        dataField: "subclassnm",
        caption: "Sub Class",
        width: 120,
        headerFilter: true,
        cellRender: (data: any) => {
          if (data.data.partyrefno === 'Sub Total' || data.data.partyrefno === 'Grand Total') {
            return <span></span>;
          }
          return <span>{data.value}</span>;
        }
      },
    ];

    return (
      <div style={{ width: '100%', height: `${height}px`, overflow: 'auto' }}>
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
          scrollingMode="virtual"
          columnAutoWidth={false}
          width="100%"
        />
      </div>
    );
  }
);

GRNDataGrid.displayName = 'GRNDataGrid';