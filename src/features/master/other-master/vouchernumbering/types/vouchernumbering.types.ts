export interface VoucherNumbering {
  id?: number;
  name: string;
  prefix: string;
  suffix: string;
  maxlength: number;
  lastno: number;
  manualallow: string;
  futuredateallow: string;
  status: string;
  voucherid: number;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}


export interface Voucher {
  id: number;
  name: string;
  type: string;
}


export interface VoucherNumberingFormData
  extends Omit<
    VoucherNumbering,
    'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'
  > {
  compid: number;
}

export interface VoucherNumberingApiResponse {
  success: boolean;
  message: string;
  data: VoucherNumbering[];
}
export interface VoucherApiResponse {
  success: boolean;
  message: string;
  data: Voucher[];
}


export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
