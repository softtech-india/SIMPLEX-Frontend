
import { forwardRef, useMemo } from 'react';
import { User } from '../types/user';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface UserDataGridProps {
  dataSource: User[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const UserDataGrid = forwardRef<any, UserDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'name', caption: 'Name', width: 200, headerFilter: true },
      { dataField: 'code', caption: 'Username', width: 200, headerFilter: true },
      // { dataField: 'pwd', caption: 'Password', width: 150, headerFilter: true },
      { dataField: 'typedesc', caption: 'User type', width: 200, headerFilter: true },
      { dataField: 'group', caption: 'User Group', width: 300, headerFilter: true },
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

UserDataGrid.displayName = 'UserDataGrid';