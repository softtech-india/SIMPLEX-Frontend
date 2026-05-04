// constants/customerFormDefaults.ts
import { CustomerFormSchema } from "../schemas/customer.schema";

export const customerFormDefaults: CustomerFormSchema = {
  name: "",
  subledgertypeid: 1,
  ledgergroupid: 28,
  cityid: 0,
  stateid: 0,
  addr1: "",
  addr2: "",
  addr3: "",
  nl: "",
  pin: "",
  phone: "",
  mobile: "",
  email: "",
  pan: "",
  crdays: 0,
  crlimit: 0,
  gstregtype: "U",
  gstin: "",
  status: "A",
};