import { z } from "zod";

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

/** Only personal information is required to save / access dashboard */
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  phone: z.string().trim().min(10, "Invalid phone number"),
  location: z.string().trim().min(2, "Location is required"),
  currentRole: z.string().trim().min(2, "Current role is required"),
  experience: z.coerce.number().min(0, "Min 0 years").max(40, "Max 40 years"),
});

export const profileFormSchema = personalInfoSchema.extend({
  email: z.string().email(),
  linkedInUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  currentCompany: z.string().optional(),
  currentCTC: z.coerce.number().optional(),
  expectedCTC: z.coerce.number().optional(),
  noticePeriod: z.coerce.number().optional(),
  employmentType: z
    .enum(["Full Time", "Internship", "Contract", "Remote", "Hybrid", "Onsite", ""])
    .optional(),
  skills: z.array(z.string()).default([]),
  techStacks: z.array(z.string()).default([]),
  preferredRoles: z.array(z.string()).default([]),
  preferredLocations: z.array(z.string()).default([]),
  salaryExpectation: z.coerce.number().optional(),
  remotePreference: z.enum(["Remote", "Hybrid", "Onsite"]).optional(),
  openToRelocation: z.boolean().default(false),
});

export type ProfileFormSchemaValues = z.infer<typeof profileFormSchema>;

export const TECH_STACK_OPTIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Cloud",
  "AI/ML",
  "Data Science",
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  "Full Time",
  "Internship",
  "Contract",
  "Remote",
  "Hybrid",
  "Onsite",
] as const;

export const REMOTE_PREFERENCE_OPTIONS = ["Remote", "Hybrid", "Onsite"] as const;

export const SUGGESTED_SKILLS = [
  "React",
  "Node.js",
  "Next.js",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Python",
  "Java",
  "GraphQL",
] as const;
