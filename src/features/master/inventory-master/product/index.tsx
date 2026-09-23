'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ProductDataGrid } from './components/ProductDataGrid';
import { ProductForm } from './components/ProductForm';
import { useProducts, useProductQR } from './hooks/product';
import { Product, OperationMode } from './types/product.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { MasterToolbar } from '@/common/components/barmanager/MasterToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { useReactiveStorage } from '@/hooks/useReactiveStorage';
import Loader from '@/common/components/Loader';

export default function ProductModule() {

  // Hooks
  const isMobile = useIsMobile()
  const permissions = usePrivileges();

  // State
  const [selectedRow, setselectedRow] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<OperationMode>('Add');
  const [formProductId, setFormProductId] = useState(0);
  const { data: ProductList = [], isLoading, refetch } = useProducts();
  const [sidebarState, setSidebarState] = useReactiveStorage('sidebarCollapsed');

  const gridRef = useRef<any>(null);
  const { mutateAsync: getQR } = useProductQR();

  // handler
  const handleSelectionChanged = useCallback((e: any) => {
    if (e.selectedRowsData && e.selectedRowsData.length > 0) {
      setselectedRow(e.selectedRowsData[0]);
    } else {
      setselectedRow(null);
    }
  }, []);

  const openForm = useCallback((mode: OperationMode) => {
    if (mode !== 'Add' && !selectedRow) return;

    if (mode === 'Add') {
      setFormProductId(0);
      setselectedRow(null);
    } else {
      setFormProductId(selectedRow?.id ?? 0);
    }

    setFormMode(mode);
    setIsFormOpen(true);
  }, [selectedRow]);;

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setFormProductId(0);
  }, []);

  // Toolbar handlers
  const handleAddClick = useCallback(() => {
    setselectedRow(null);
    openForm('Add');
  }, [openForm]);
  const handleEditClick = useCallback(() => openForm('Edit'), [openForm]);
  const handleDeleteClick = useCallback(() => openForm('Delete'), [openForm]);
  const handleViewClick = useCallback(() => openForm('View'), [openForm]);

  const handlePrintClick = useCallback(async () => {
    const row = selectedRow;
    if (!row) return;

    const blob = await getQR(row.id);
    if (!blob) return;

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const companyLogo = `${window.location.origin}/images/zenith-gold.png`;

    const printContent =
      `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Print Label</title>

        <style>
          @page {
            size: 100mm 75mm landscape;
            margin: 0;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html,
          body {
            width: 100mm;
            height: 75mm;
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #fff;
            overflow: hidden;
          }
          @media print {
            html,
            body {
              width: 100mm;
              height: 75mm;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          .container {
            width: 88mm;
            height: 63mm;
            margin: 6mm;
            border: 1px solid #222;
            padding: 3mm;
            display: flex;
            flex-direction: column;
            background: #fff;
            overflow: hidden;
          }
          .header {
            width: 100%;
            height: 25mm;
            display: flex;
            align-items: flex-start;
            margin-top: 2mm;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2mm;
          }
          .company-section {
            width: 58%;
            display: flex;
            align-items: center;
            gap: 2.5mm;
            height: 100%;
          }
          .company-logo {
            width: 30mm;
            height: 30mm;
            object-fit: contain;
            flex-shrink: 0;
          }
          .company-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 0;
          }
          .company-name {
            font-size: 16px;
            font-weight: bold;
            color: #111;
            line-height: 1.1;
            word-break: break-word;
          }
          .qr-section {
            width: 50%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          .qr-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .qr-image {
            width: 24mm;
            height: 24mm;
            object-fit: contain;
            display: block;
          }
          .qr-code-text {
            font-size: 10px;
            font-weight: bold;
            color: #222;
            text-align: center;
            letter-spacing: 0.3px;
          }
          .product-section {
            flex: 1;
            padding-top: 2.5mm;
            display: flex;
            flex-direction: column;
            min-height: 0;
          }
          .details-grid {
            width: 100%;
            display: grid;
            grid-template-columns: 10mm 1fr;
            row-gap: 1.7mm;
            column-gap: 2mm;
            font-size: 12px;
          }
          .detail-label {
            font-weight: bold;
            color: #333;
            white-space: nowrap;
          }
          .detail-value {
            color: #111;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-word;
            overflow-wrap: break-word;
          }
            
    </style>

      </head>

      <body>
        <div class="container">

          <div class="header">
            <div class="company-section">
              <img src="${companyLogo}" alt="Logo" class="company-logo" />
            </div>

            <div class="qr-section">
              <div class="qr-wrapper">
                <img src="${base64}" alt="QR Code" class="qr-image" />
                <div class="qr-code-text">${(row.productcode)}</div>
              </div>
            </div>
          </div>

          <div class="product-section">
            <div class="details-grid">
              <div class="detail-label">Name</div>
              <div class="detail-value">${(row.productname)}</div>
              <div class="detail-label">Brand</div>
              <div class="detail-value">${(row.categorynm)}</div>
              <div class="detail-label">Code</div>
              <div class="detail-value">${(row.productcode)}</div>
            </div>
          </div>

        </div>

        <script>
          // Auto print
          window.onload = function () {
            setTimeout(function () {
              window.print();
            }, 250);
          };

          // Close after printing
          window.onafterprint = function () {
            window.close();
          };

          // Fallback
          window.matchMedia("print").addEventListener("change", function (e) {
            if (!e.matches) {
              setTimeout(function () {
                window.close();
              }, 500);
            }
          });
        </script>
      </body>
    </html>
      `;


    // Open in new window and trigger print
    const blob1 = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob1);
    // const printWindow = window.open(url, "_blank", "width=400,height=300");
    const printWindow = window.open(url, "_blank");

    // Clean up the object URL after the window loads
    if (printWindow) {
      printWindow.onload = () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // Fallback if popup is blocked
      URL.revokeObjectURL(url);
      alert("Please allow popups for this website to print labels");
    }
  }, [selectedRow, getQR]);

  const handleRefresh = useCallback(() => {
    refetch();
    setFormProductId(0);
    setselectedRow(null);
  }, [refetch]);

  const handleExport = useCallback(() => {
    if (!ProductList || ProductList.length === 0) return;

    // Generate columns dynamically from first row keys
    const columns: ExcelColumn[] = Object.keys(ProductList[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      width: 20,
    }));

    exportToExcel({
      data: ProductList,
      columns,
      fileName: "User Unit List.xlsx",
      sheetName: "userUnitList",
    });
  }, [ProductList]);


  return (
    <div className="User-Product-module">

      <div className="bg-white rounded-xl shadow-sm border my-1">
        <MasterToolbar
          title="User Unit Master"
          permissions={permissions}
          //  hasSelection={!!selectedRow}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRefresh={handleRefresh}
          onView={handleViewClick}
          onPrint={handlePrintClick}
          onExport={handleExport}
        />
      </div>

      {!isMobile && (
        <div className={`${sidebarState === '1' ? 'w-362' : 'w-294'} transition-all duration-300 ease-in-out rounded-xl shadow-sm border border-gray-200 p-1 overflow-x-auto `} >
          <ProductDataGrid
            dataSource={ProductList}
            onSelectionChanged={handleSelectionChanged}
            showFilterRow
            showColumnChooser
            selectionMode="single"
            onExporting={handleExport}
            height={500}
          />
        </div>
      )}

      <ProductForm
        visible={isFormOpen}
        onClose={handleFormClose}
        ProductId={formProductId}
        mode={formMode}
      />

      {isLoading && <Loader />}

    </div>
  );
}