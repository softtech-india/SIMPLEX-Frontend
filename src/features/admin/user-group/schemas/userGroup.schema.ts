import { z } from "zod";

export const userGroupSchema = z.object({
  group: z.string().min(1, "Group is required"),

});

export type userGroupFormSchema = z.infer<typeof userGroupSchema>;