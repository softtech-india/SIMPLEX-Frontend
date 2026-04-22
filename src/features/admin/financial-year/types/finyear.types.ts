export interface Finyear {
  id: number;
  findesc?: string;
  finstdt: string;
  finenddt: string;
  status?: string;
  statusdesc?: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface FinyearFormData extends Omit<Finyear, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface FinyearApiResponse {
  success: boolean;
  message: string;
  data: Finyear[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
