export interface ProdClass {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdClassFormData extends Omit<ProdClass, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface ProdClassApiResponse {
  success: boolean;
  message: string;
  data: ProdClass[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
