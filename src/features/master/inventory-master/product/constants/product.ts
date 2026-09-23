import { ProductFormSchema } from "../schemas/product.schema";

export const ProductDefaultValues: ProductFormSchema = {
  productcode: "",
  productname: "",
  aliasname: "",
  categorynm: "",
  
  productcategoryid: 0,
  productclassid: 0,
  productsubclassid: 0,

  unitid: 1,
  producttype: "FG",

  minimumlevel: 0,
  reorderlevel: 0,

  valuationtype: "A",
  batchrequire: "N",

  alterunitid: 1,
  alterunitfactor: 0,
  alterunitfactortype: "M",
  alterunitmethod: "A",

  mrp: 0,

  hsnid: 0,
  gstid: 0,

  closedtag: "A",

  purchaserateon: 1,
  salerateon: 1,
};