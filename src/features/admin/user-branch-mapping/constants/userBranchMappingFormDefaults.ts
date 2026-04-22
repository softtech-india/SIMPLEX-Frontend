import { userBranchMappingFormSchema } from "../schemas/userBranchMapping.schema";

export const userBranchMappingFormDefaults: userBranchMappingFormSchema = {
  compid: 0,
  brnchid: 0,
  mapuserid: 0,
  isdefault: "Y",
  status: "A",
};