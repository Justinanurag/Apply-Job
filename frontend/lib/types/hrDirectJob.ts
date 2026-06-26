export interface HrDirectJob {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  experienceRequired: string | null;
  skills: string[];
  hrName: string | null;
  hrEmail: string;
  description: string | null;
  sourceUrl: string;
  source: string;
  workMode: string | null;
  postedAt: string | null;
  postedText: string | null;
  searchKeyword: string | null;
  createdAt: string;
  updatedAt: string;
  matchScore: number | null;
  missingSkills: string[];
  matchReason: string | null;
  tailoredResumeText: string | null;
  coverLetter: string | null;
  recruiterEmailBody: string | null;
  emailSentAt: string | null;
}

export interface HrDirectJobsListResponse {
  jobs: HrDirectJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HrDirectFilters {
  search?: string;
  location?: string;
  source?: string;
  minMatchScore?: number;
  workMode?: "all" | "remote" | "onsite" | "hybrid";
  experience?: string;
  page?: number;
  limit?: number;
}
