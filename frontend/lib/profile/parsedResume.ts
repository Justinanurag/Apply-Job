import type { UserProfile } from "@/lib/types/profile";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  phone: "Phone",
  location: "Location",
  currentRole: "Role",
  experience: "Experience",
  linkedInUrl: "LinkedIn",
  githubUrl: "GitHub",
  portfolioUrl: "Portfolio",
  currentCompany: "Company",
  skills: "Skills",
  techStacks: "Tech stack",
  preferredRoles: "Preferred roles",
  preferredLocations: "Locations",
};

export function describeParsedResumeFields(parsed?: Partial<UserProfile> | null): string {
  if (!parsed) return "";

  const filled = Object.entries(parsed).filter(([, value]) => {
    if (value == null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  });

  if (filled.length === 0) return "";

  return filled
    .map(([key]) => FIELD_LABELS[key] ?? key)
    .join(", ");
}
