export interface Ledger {
  id: number;
  ledgername: string;
  ledgergroupid: number;

  ledgeraddr1: string;
  ledgeraddr2: string;
  ledgeraddr3: string;

  ledgerphone: string;
  ledgeremail: string;
  ledgerwebsite: string;
  ledgerpan: string;

  intmethod: string;
  intpct: number;

  closedtag: string;

  bankbranch: string;

  taxnature: string;

  stockeffect: string;
  costcenterapplicable: string;
  allownegetive: string;
  iscardewallet: string;

  salarydeducttype: string;
  salarynarration: string;
}

export interface LedgerAPI {
  id: number;
  ledgercode: string;
  ledgername: string;

  ledgergroupid: number;
  ledgergroupnm: string;

  ledgeraddr1: string;
  ledgeraddr2: string;
  ledgeraddr3: string;

  ledgerphone: string;
  ledgeremail: string;
  ledgerwebsite: string;
  ledgerpan: string;

  intmethod: string;
  intmethoddesc: string;
  intpct: number;

  closedtag: string;
  status: string;

  bankbranch: string;

  taxnature: string;
  taxnaturedesc: string;

  stockeffect: string;
  stockeffectdesc: string;

  costcenterapplicable: string;
  costcenterapplicabledesc: string;

  allownegetive: string;
  allownegetivedesc: string;

  iscardewallet: string;
  iscardewalletdesc: string;

  salarydeducttype: string;
  salarydeducttypedesc: string;

  salarynarration: string;

  grouptype: string;

  entryby: string;
  entrydt: string;

  updateby: string;
  updatedt: string;
}

export interface LedgerFormType extends Omit<Ledger, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface LedgerApiResponse {
  success: boolean;
  message: string;
  totalcount: number;
  data: LedgerAPI[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
