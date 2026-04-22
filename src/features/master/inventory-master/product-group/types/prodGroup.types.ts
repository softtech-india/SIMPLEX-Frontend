export interface ProdGroup {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdGroupFormData extends Omit<ProdGroup, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface ProdGroupApiResponse {
  success: boolean;
  message: string;
  data: ProdGroup[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
