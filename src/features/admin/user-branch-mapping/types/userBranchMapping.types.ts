export interface UserBranchMapping {
  compid: number,
  brnchid: number,
  mapuserid: number,
  isdefault?: string,
  status?: string,
}

export interface UserBranchMappingFormType extends Omit<UserBranchMapping, 'compid' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface UserBranchMappingApiResponse {
  success: boolean;
  message: string;
  data: UserBranchMapping[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
