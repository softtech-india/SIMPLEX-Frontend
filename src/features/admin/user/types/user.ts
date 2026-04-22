export interface User {
  id: number;

  name: string;
  loginid: string;
  code?: string;
  pwd: string;
  confirmPwd: string;
  type?: string;
  groupid?: number;
  statedisp?: string;
  backdtentry?: string;
  contactno?: string;
  email?: string;
  remarks?: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface UserFormData extends Omit<User, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface UserApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
