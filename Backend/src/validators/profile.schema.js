import { z } from "zod";

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

/** Required only for initial profile / dashboard access */
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required"),
  phone: z.string().trim().min(10, "Invalid phone number"),
  location: z.string().trim().min(2, "Location is required"),
  currentRole: z.string().trim().min(2, "Current role is required"),
  experience: z.coerce.number().min(0).max(40),
});

const optionalFields = {
  linkedInUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  currentCompany: z.string().optional(),
  currentCTC: z.coerce.number().optional(),
  expectedCTC: z.coerce.number().optional(),
  noticePeriod: z.coerce.number().optional(),
  employmentType: z
    .enum(["Full Time", "Internship", "Contract", "Remote", "Hybrid", "Onsite"])
    .optional(),
  skills: z.array(z.string()).optional().default([]),
  techStacks: z.array(z.string()).optional().default([]),
  preferredRoles: z.array(z.string()).optional().default([]),
  preferredLocations: z.array(z.string()).optional().default([]),
  salaryExpectation: z.coerce.number().optional(),
  remotePreference: z.enum(["Remote", "Hybrid", "Onsite"]).optional(),
  openToRelocation: z.boolean().optional().default(false),
};

/** Save profile — personal info required, everything else optional */
export const saveProfileSchema = personalInfoSchema.extend(optionalFields);

/** PATCH — all fields optional, validate format when provided */
export const profilePatchSchema = z
  .object({
    fullName: z.string().trim().min(3).optional(),
    phone: z.string().trim().min(10).optional(),
    location: z.string().trim().min(2).optional(),
    currentRole: z.string().trim().min(2).optional(),
    experience: z.coerce.number().min(0).max(40).optional(),
    ...optionalFields,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

/** Full profile for 100% AI-ready completion */
export const fullProfileSchema = personalInfoSchema.extend({
  ...optionalFields,
  skills: z.array(z.string()).min(1),
  techStacks: z.array(z.string()).min(1),
  preferredRoles: z.array(z.string()).min(1),
  preferredLocations: z.array(z.string()).min(1),
  remotePreference: z.enum(["Remote", "Hybrid", "Onsite"]),
  openToRelocation: z.boolean(),
});

export const checkMinimumProfile = (profile) => {
  if (!profile) return false;
  return personalInfoSchema.safeParse({
    fullName: profile.fullName,
    phone: profile.phone,
    location: profile.location,
    currentRole: profile.currentRole,
    experience: profile.experience ?? 0,
  }).success;
};

export const calculateCompletion = (profile) => {
  if (!profile) return 0;

  const fields = [
    profile.fullName,
    profile.phone,
    profile.location,
    profile.currentRole,
    profile.experience != null,
    profile.skills?.length > 0,
    profile.techStacks?.length > 0,
    profile.preferredRoles?.length > 0,
    profile.preferredLocations?.length > 0,
    profile.remotePreference,
    profile.resumeUrl,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

export const checkProfileComplete = (profile) => {
  if (!profile || !profile.resumeUrl) return false;

  const result = fullProfileSchema.safeParse({
    ...profile,
    linkedInUrl: profile.linkedInUrl ?? "",
    githubUrl: profile.githubUrl ?? "",
    portfolioUrl: profile.portfolioUrl ?? "",
    skills: profile.skills ?? [],
    techStacks: profile.techStacks ?? [],
    preferredRoles: profile.preferredRoles ?? [],
    preferredLocations: profile.preferredLocations ?? [],
    openToRelocation: profile.openToRelocation ?? false,
    remotePreference: profile.remotePreference ?? "Remote",
  });

  return result.success;
};
