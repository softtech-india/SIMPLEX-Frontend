import { finyearFormSchema } from "../schemas/finyear.schema";

const today = new Date().toISOString().split("T")[0];

export const finyearDefaultValues: finyearFormSchema = {
  findesc: '',
  finstdt: today,
  finenddt: today,
  status: '',
  statusdesc: '',
};