export interface UserGroup {
  id: number;
  group: string;
  
  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface UserGroupFormData extends Omit<UserGroup, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface UserGroupApiResponse {
  success: boolean;
  message: string;
  data: UserGroup[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
