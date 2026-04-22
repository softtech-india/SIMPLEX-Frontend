import { z } from "zod";

export const userBranchMappingSchema = z.object({

  compid: z.number().min(1, "Company is required"),
  brnchid: z.number().min(1, "Branch ID must be greater than 0"),
  mapuserid: z.number().min(1, "User ID is required").optional(), 
  isdefault: z.string().optional(),
  status: z.string().optional(),

});

export type userBranchMappingFormSchema = z.infer<typeof userBranchMappingSchema>;