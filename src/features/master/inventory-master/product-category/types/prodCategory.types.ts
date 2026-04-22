export interface ProdCategory {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdCategoryFormData extends Omit<ProdCategory, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface ProdCategoryApiResponse {
  success: boolean;
  message: string;
  data: ProdCategory[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
