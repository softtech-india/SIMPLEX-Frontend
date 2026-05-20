export interface UserPrivilege {
  formid: number;
  formnm: string;
  formtype: string;
  parentid: number | null;

  isAdded: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  isExported: boolean;
  isPrinted: boolean;
  isViewed: boolean;
  isEmailed: boolean;
  isApproved: boolean;
}

export interface UserItem {
  id: number;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export type OperationMode = | "Add" | "Edit" | "Delete" | "View" | "Print";