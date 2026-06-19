export type RemotePreference = "Remote" | "Hybrid" | "Onsite";

export type EmploymentType =
  | "Full Time"
  | "Internship"
  | "Contract"
  | "Remote"
  | "Hybrid"
  | "Onsite";

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string | null;
  phone: string | null;
  location: string | null;
  currentRole: string | null;
  experience: number | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  currentCompany: string | null;
  currentCTC: number | null;
  expectedCTC: number | null;
  noticePeriod: number | null;
  employmentType: EmploymentType | null;
  skills: string[];
  techStacks: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  salaryExpectation: number | null;
  remotePreference: RemotePreference | null;
  openToRelocation: boolean;
  resumeUrl: string | null;
  resumeName: string | null;
  resumeUploadedAt: string | null;
  isComplete: boolean;
  completionPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  profile: UserProfile | null;
  email: string;
  completionPercent: number;
  isComplete: boolean;
  canAccessDashboard: boolean;
  parsedFromResume?: Partial<UserProfile>;
}

export interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  experience: number;
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  currentCompany: string;
  currentCTC: number | undefined;
  expectedCTC: number | undefined;
  noticePeriod: number | undefined;
  employmentType: EmploymentType | "";
  skills: string[];
  techStacks: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  salaryExpectation: number | undefined;
  remotePreference: RemotePreference | undefined;
  openToRelocation: boolean;
}
