'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import { ProductDataGrid } from './components/ProductDataGrid';
import { ProductForm } from './components/ProductForm';
import { useProducts, useProduct, useGsts, useProductQR } from './hooks/product';
import { Product, OperationMode } from './types/product.types';
import useIsMobile from "@/common/hooks/useIsMobile";
import { MasterToolbar } from '@/common/components/barmanager/MasterToolbar';
import { usePrivileges } from '@/common/hooks/usePrivileges';
import { exportToExcel, ExcelColumn } from '@/common/utility/exportToExcel';
import { productService } from './services/product';
import jsPDF from 'jspdf';
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

  async function getQRBlob(id: number): Promise<Blob | null> {
    try {
      const blob = await getQR(id);

      if (!blob || blob.size === 0) {
        console.error("Empty QR blob returned");
        return null;
      }

      return blob;
    } catch (err: any) {
      console.error("QR Error:", err);
      return null;
    }
  }

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

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [75, 100], // Height = 75mm, Width = 100mm
    });

    // Border
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(6, 6, 90, 68);

    // Font
    pdf.setFontSize(16);

    const labelX = 10;
    const valueX = 30;

    // Labels
    pdf.setFont("helvetica", "bold");
    pdf.text("Name :", labelX, 12);
    pdf.text("Brand :", labelX, 18);
    pdf.text("Code :", labelX, 24);

    // Values 
    pdf.setFont("helvetica", "normal");
    pdf.text(`${row.productname }`|| "-", valueX, 12);
    pdf.text(`${row.categorynm }` || "-", valueX, 18);
    pdf.text(`${row.productcode }`|| "-", valueX, 24);

    // QR Code (cente` ${row.productname }` red)
    pdf.addImage(
      base64,
      "PNG",
      50, // x
      28, // y
      42, // width
      42  // height
    );

    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);

    window.open(url, "_blank");
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

      <div className="bg-white rounded-xl shadow-sm border mt-2">
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
        <div
          className={`
      ${sidebarState === '1' ? 'w-358' : 'w-294'}
      transition-all duration-300 ease-in-out
      px-2 sm:px-2 md:px-2 bg-white lg:px-2
      rounded-xl shadow-sm border border-gray-200
      p-2 overflow-x-auto my-4
    `}
        >
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