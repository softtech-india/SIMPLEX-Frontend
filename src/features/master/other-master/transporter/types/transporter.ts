export interface Transporter {
  id?: number;
  name: string,
  addr1: string,
  addr2?: string,
  addr3?: string,
  mobno: string,
  phno: string,
  email: string,
  contperson: string,
  gstin: string,

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface TransporterFormData extends Omit<Transporter, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt' & {}> { }

export interface TransporterApiResponse {
  success: boolean;
  message: string;
  data: Transporter[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
