export interface Job {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  source: string;
  applyUrl: string;
  description: string | null;
  snippet: string | null;
  skills: string[];
  postedAt: string | null;
  postedText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobSearchPayload {
  keyword: string;
  location?: string;
}

export interface JobSearchResult {
  keyword: string;
  location: string | null;
  queriesRun: number;
  stored: number;
  skipped: number;
  jobs: Job[];
}

export interface JobsListResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** UI-friendly job with optional match placeholders */
export interface JobListItem extends Job {
  match?: number;
  atsScore?: number;
  missingSkills?: string[];
  requiredSkills?: string[];
  salary?: string;
  type?: string;
  postedAt?: string;
  postedLabel?: string;
  postedKind?: "posted" | "discovered";
}
