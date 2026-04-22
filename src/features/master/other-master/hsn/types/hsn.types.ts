export interface HSN {
  id: number;
  hsn: string,
  description: string,
  gstid: number,
  type: string

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface GST {
  id: number;
  name: string;
  type: string;
  typeDesc: string;

  sapplicable: string;
  sadjust: string;
  sround: number;
  sroundDesc: string;
  scosteffect: string;

  papplicable: string;
  padjust: string;
  pround: number;
  proundDesc: string;
  pcosteffect: string;

  sgst: number;
  sgstsaccid: number;
  sgstsaccname: string;
  sgstpaccid: number;
  sgstpaccname: string;

  cgst: number;
  cgstsaccid: number;
  cgstsaccname: string;
  cgstpaccid: number;
  cgstpaccname: string;

  igst: number;
  igstsaccid: number;
  igstsaccname: string;
  igstpaccid: number;
  igstpaccname: string;

  category: string;
  categorydesc: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface HSNFormData extends Omit<HSN, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface HSNApiResponse {
  success: boolean;
  message: string;
  data: HSN[];
}

export interface GSTApiResponse {
  success: boolean;
  message: string;
  data: GST[]
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
