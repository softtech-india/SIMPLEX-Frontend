import { userFormSchema } from "../schemas/user.schema";

export const userDefaultValues: userFormSchema = {
  name: '',
  loginid: '',
  pwd: '',
  confirmPwd: '',
  type: '',
  groupid: 0,
  statedisp: '',
  backdtentry: '',
  contactno: '',
  email: '',
  remarks: '',
};