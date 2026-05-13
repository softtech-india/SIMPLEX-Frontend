import { storageService } from "@/common/utility/storageService";
import { GRNFilterState } from "../types/grnRegister.type";

const today = new Date().toISOString().split("T")[0];
const stateId = storageService.getItem('stateid');

export const DEFAULT_GRN_FILTER: GRNFilterState = {
  userid: 0,
  compid: 0,
  branchid: 0,
  finid: 0,
  startdt: today,
  enddt: today,
  strbrand: '',
  strclass: '',
  strparty: '',
  stateid: Number(stateId) || 0
};