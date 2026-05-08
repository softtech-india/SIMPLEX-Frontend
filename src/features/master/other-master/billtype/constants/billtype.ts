import { BillTypeFormSchema } from "../schemas/billtype.schema";

export const BillTypeDefaultValues: BillTypeFormSchema = {
  name: '',
  type: 'SA',
  accspecify: 'SG',
  accountheadid: 0,
  taxregion: 'L',
  typeoftransaction: 'OT',
  taxapplicable: 'ST',
  istaxinclude: 'N',
  isdefault: 'N',
  posapplicable: 'N'
};