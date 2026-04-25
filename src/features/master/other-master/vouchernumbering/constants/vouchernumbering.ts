import { VoucherNumberingFormSchema } from "../schemas/VoucherNumbering";

export const VoucherNumberingDefaultValues: VoucherNumberingFormSchema = {
  name: '',
  voucherid: 0,
  prefix: '',
  suffix: '',
  maxlength: 0,
  lastno: 0,
  manualallow: 'N',
  futuredateallow: 'N',
  status: 'A',
};