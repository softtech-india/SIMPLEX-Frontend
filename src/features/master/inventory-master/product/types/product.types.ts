export interface Product {
  id: number;
  productcode: string;
  productname: string;
  aliasname: string;
  productcategoryid: number;
  productclassid: number;
  productsubclassid: number;
  unitid: number;
  producttype: string;
  minimumlevel: number;
  reorderlevel: number;
  valuationtype: string;
  batchrequire: string;
  alterunitid: number;
  alterunitfactor: number;
  alterunitfactortype: string;
  alterunitmethod: string;
  mrp: number;
  hsnid: number;
  gstid: number;
  closedtag: string;
  purchaserateon: number;
  salerateon: number;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}


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

export interface ProdCategory {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdClass {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

export interface ProdGroup {
  id: number;
  name: string;

  entryby?: string;
  entrydt?: string;
  updateby?: string;
  updatedt?: string;
}

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

export interface ProductFormData extends Omit<Product, 'id' | 'entryby' | 'entrydt' | 'updateby' | 'updatedt'> { }

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface GSTApiResponse {
  success: boolean;
  message: string;
  data: GST[]
}

export interface HSNApiResponse {
  success: boolean;
  message: string;
  data: HSN[]
}

export interface ProdCategoryApiResponse {
  success: boolean;
  message: string;
  data: ProdCategory[];
}

export interface ProdClassApiResponse {
  success: boolean;
  message: string;
  data: ProdClass[];
}

export interface ProdGroupApiResponse {
  success: boolean;
  message: string;
  data: ProdGroup[];
}

export interface ProdUnitApiResponse {
  success: boolean;
  message: string;
  data: ProdUnit[];
}

export type OperationMode = 'Add' | 'Edit' | 'Delete' | 'View' | 'Print';
