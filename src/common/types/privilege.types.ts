export interface Privilege {
  path: string;

  isadded?: boolean;
  isupdated?: boolean;
  isdeleted?: boolean;
  isviewed?: boolean;
  isprinted?: boolean;
  isexported?: boolean;
  isemailed?: boolean;

  items?: Privilege[];
}

export interface Permissions {
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canPrint: boolean;
  canExport: boolean;
  canEmail: boolean;
  hasAnyAccess: boolean;
}

export type Action =
  | 'add'
  | 'edit'
  | 'delete'
  | 'view'
  | 'print'
  | 'export'
  | 'email';