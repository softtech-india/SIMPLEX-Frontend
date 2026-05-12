import { SaleRegisterFilterState } from "../types/saleRegister.type";

// In your types file
const today = new Date().toISOString().split("T")[0];
export const DEFAULT_SALE_REGISTER_FILTER: SaleRegisterFilterState = {
    userid: 0,
    compid: 0,
    branchid: 2,
    finid: 0,
    startdt: today,
    enddt: today,
    sortby: 0,
    stateid: 32,
    trantype: 0,
    withProduct: 0
};