import { StockTrialFilterState } from "../types/stockTrial.types";

const today = new Date().toISOString().split("T")[0];

export const DEFAULT_STOCK_TRIAL_FILTER: StockTrialFilterState = {
    userid: 0,
    compid: 0,
    branchid: 0,
    finid: 0,
    startdt: today,
    enddt: today,
    printrtval: 1,
    strbrand: '',
    strclass: '',
    strsubclass: '',
    balancetag: 1,
    strgodown: '',
};