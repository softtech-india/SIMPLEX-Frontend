import { userFormSchema } from "../schemas/user.schema";

export const userDefaultValues: userFormSchema = {
  name: '',
  loginid: '',
  pwd: '',
  confirmPwd: '',
  type: 'U',
  groupid: 0,
  statedisp: 'A',
  backdtentry: 'N',
  contactno: '',
  email: '',
  remarks: '',
  status: 'A',
};