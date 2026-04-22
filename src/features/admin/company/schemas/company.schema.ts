import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  printname: z.string().min(1, "Print Name is required"),
  shortname: z.string().min(1, "Short Name is required"),
  nature: z.string().min(1, "Business Nature is required"),
  status: z.string().optional(),

  add1: z.string().min(1, "Address is required"),
  add2: z.string().optional(),
  add3: z.string().optional(),
  add4: z.string().optional(),
  stateId: z.number(),
  cityId: z.number(),
  pin: z.string().optional(),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),

  email: z.string().optional(),
  website: z.string().optional(),

  //gstin: z.string().min(1, "GTS No is required").regex(/^$|^[0-9A-Z]{15}$/, "Invalid GSTIN format"),
  gstin: z.string().regex(/^$|^[0-9A-Z]{15}$/, "Invalid GSTIN format").optional(),
  cin: z.string().optional(),
  pan: z.string().min(1, "Pan No is required"),
  tan: z.string().optional(),
  ieccode: z.string().optional(),
});

export type CompanyFormSchema = z.infer<typeof companySchema>;