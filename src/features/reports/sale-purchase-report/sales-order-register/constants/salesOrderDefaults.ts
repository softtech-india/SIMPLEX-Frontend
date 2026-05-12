//sales-order-register/constants/salesOrderDefaults.ts
import { storageService } from "@/common/utility/storageService";
import { SalesOrderFilterState } from "../types/salesOrder.type";

const today = new Date().toISOString().split("T")[0];
const stateId = storageService.getItem('stateid');

export const DEFAULT_SALES_ORDER_FILTER: SalesOrderFilterState = {
  userid: 0,
  compid: 0,
  branchid: 0,
  finid: 0,
  startdt: today,
  enddt: today,
  strbrand: '',
  strclass: '',
  strsubclass: '',
  sortby: 0,
  stateid: Number(stateId) | 0,
  partyid: 0,
  orderstatus: 0
};

export const SORT_BY_OPTIONS = [
  { id: 0, name: "Date" },
  { id: 1, name: "Order No" },
  { id: 2, name: "Party" }
];

export const ORDER_STATUS_OPTIONS = [
  { id: 0, name: "All" },
  { id: 1, name: "Pending" },
  { id: 2, name: "Complete" }
];