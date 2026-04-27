import { z } from "zod";

export const userSchema = z.object({

  name: z.string().min(1, "User is required"),
  loginid: z.string().min(1, "Username is required"),
  code: z.string().optional(),

  pwd: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirmPwd: z.string().min(1, "Confirm Password is required",),

  type: z.string().min(1, "Type is required").optional(),
  groupid: z.number().optional(),
  statedisp: z.string().optional(),
  backdtentry: z.string().optional(),
  contactno: z.string().optional(),
  email: z.string().optional(),
  remarks: z.string().optional(),
  status: z.string().optional(),

}).superRefine(({ pwd, confirmPwd }, ctx) => {
  if (pwd !== confirmPwd) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirmPwd"],
    });
  }
});


export type userFormSchema = z.infer<typeof userSchema>;