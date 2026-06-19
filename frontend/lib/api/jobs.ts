import api from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { Job, JobSearchPayload, JobSearchResult, JobsListResponse } from "@/lib/types/job";

export const jobsApi = {
  async search(payload: JobSearchPayload): Promise<JobSearchResult> {
    const { data } = await api.post<ApiSuccessResponse<JobSearchResult>>(
      "/api/jobs/search",
      payload
    );
    return data.data;
  },

  async collectFromProfile(): Promise<JobSearchResult> {
    const { data } = await api.post<ApiSuccessResponse<JobSearchResult>>(
      "/api/jobs/collect-profile"
    );
    return data.data;
  },

  async list(params?: {
    search?: string;
    source?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<JobsListResponse> {
    const { data } = await api.get<ApiSuccessResponse<JobsListResponse>>("/api/jobs", {
      params,
    });
    return data.data;
  },

  async getById(id: string): Promise<Job> {
    const { data } = await api.get<ApiSuccessResponse<Job>>(`/api/jobs/${id}`);
    return data.data;
  },
};
