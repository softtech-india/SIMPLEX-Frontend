
import { forwardRef, useMemo } from 'react';
import { HSN, Product } from '../types/product.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface ProductDataGridProps {
  dataSource: Product[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const ProductDataGrid = forwardRef<any, ProductDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'productcode', caption: 'Code', width: 100, headerFilter: true },
      { dataField: 'productname', caption: 'Name', width: 220, headerFilter: true },
      { dataField: 'aliasname', caption: 'Print Name', width: 200, headerFilter: true },
      { dataField: 'categorynm', caption: 'Category', width: 150, headerFilter: true },
      { dataField: 'classnm', caption: 'Class', width: 150, headerFilter: true },
      { dataField: 'subclassnm', caption: 'Sub Class', width: 150, headerFilter: true },
      { dataField: 'unit', caption: 'Unit', width: 100 },
      { dataField: 'altunit', caption: 'Alt Unit', width: 100 },
      { dataField: 'hsnNo', caption: 'HSN', width: 120 },
      { dataField: 'gstName', caption: 'GST', width: 120 },
      { dataField: 'ptypeDesc', caption: 'Product Type', width: 150, headerFilter: true },
      { dataField: 'goodsservicetypedesc', caption: 'Goods/Service', width: 100 },
      { dataField: 'mrp', caption: 'MRP', width: 100, dataType: 'number' },
      { dataField: 'statusdesc', caption: 'Status', width: 100 },
      { dataField: 'factortypedesc', caption: 'Factor Type', width: 150 },
      { dataField: 'methoddesc', caption: 'Unit Method', width: 150 },
      { dataField: 'batchrequiredesc', caption: 'Batch Require', width: 100 },
      { dataField: 'valuationdesc', caption: 'Valuation', width: 100 },

      { dataField: 'entryby', caption: 'Entry User', width: 120 },
      { dataField: 'entrydt', caption: 'Entry Date', width: 160 }, // keep as string unless parsed
      { dataField: 'updateby', caption: 'Update User', width: 120 },
      { dataField: 'updatedt', caption: 'Update Date', width: 160 },

    ], []);

    return (
      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="id"
        showColumnChooser={true}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={height}
      />
    );
  }
);

ProductDataGrid.displayName = 'ProductDataGrid';