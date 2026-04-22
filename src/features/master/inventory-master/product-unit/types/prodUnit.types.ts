export interface ProdUnit {
  id: number;
  name: string,
  description: string,
  decimalplace: number,
  gstunit: string

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}
export interface GstUnit {
  id: number;
  gstunit: string

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdUnitFormData extends Omit<ProdUnit, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface ProdUnitApiResponse {
  success: boolean;
  message: string;
  data: ProdUnit[];
}
export interface GstUnitApiResponse {
  success: boolean;
  message: string;
  data: GstUnit[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
