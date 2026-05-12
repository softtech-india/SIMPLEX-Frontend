import { storageService } from "@/common/utility/storageService";
import { SaleRegisterFilterState } from "../types/saleRegister.type";

// In your types file
const today = new Date().toISOString().split("T")[0];
const stateId = storageService.getItem('stateid');

export const DEFAULT_SALE_REGISTER_FILTER: SaleRegisterFilterState = {
    userid: 0,
    compid: 0,
    branchid: 2,
    finid: 0,
    startdt: today,
    enddt: today,
    sortby: 0,
    stateid: Number(stateId) | 0,
    trantype: 0,
    withProduct: 0
};