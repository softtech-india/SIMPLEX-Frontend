
import { forwardRef, useMemo } from 'react';
import { UserBranchMapping } from '../types/userBranchMapping.types';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';

interface UserBranchMappingDataGridProps {
  dataSource: UserBranchMapping[];
  onSelectionChanged: (e: any) => void;
  onExporting: (e: any) => void;
  showFilterRow?: boolean;
  showColumnChooser?: boolean;
  selectionMode?: "single" | "multiple" | "none";
  height?: number | string;
}

export const UserBranchMappingDataGrid = forwardRef<any, UserBranchMappingDataGridProps>(
  ({ dataSource, onSelectionChanged, onExporting, height = 600 }, ref) => {

    const columns = useMemo(() => [
      { dataField: 'compname', caption: 'Name', width: 150, headerFilter: true },
      { dataField: 'brnchname', caption: 'Branch Name', width: 150, headerFilter: true },
      { dataField: 'username', caption: 'Username', width: 150, headerFilter: true },
      { dataField: 'isdefaultdesc', caption: 'User type', width: 100, headerFilter: true },
      { dataField: 'statusdesc', caption: 'Status', width: 100, headerFilter: true },
    ], []);

    return (
      <CustomDataGrid
        dataSource={dataSource}
        columns={columns}
        keyExpr="compid"
        showColumnChooser={true}
        onSelectionChanged={onSelectionChanged}
        onExporting={onExporting}
        selectionMode="single"
        height={height}  
      />
    );
  }
);

UserBranchMappingDataGrid.displayName = 'UserBranchMappingDataGrid';