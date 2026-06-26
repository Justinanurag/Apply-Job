import api from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { HrDirectJob, HrDirectFilters, HrDirectJobsListResponse } from "@/lib/types/hrDirectJob";

export const hrDirectJobsApi = {
  async list(params?: HrDirectFilters): Promise<HrDirectJobsListResponse> {
    const { data } = await api.get<ApiSuccessResponse<HrDirectJobsListResponse>>(
      "/api/hr-direct-jobs",
      { params }
    );
    return data.data;
  },

  async getById(id: string): Promise<HrDirectJob> {
    const { data } = await api.get<ApiSuccessResponse<HrDirectJob>>(`/api/hr-direct-jobs/${id}`);
    return data.data;
  },

  async collect(payload?: { keyword?: string; location?: string }) {
    const { data } = await api.post<ApiSuccessResponse<{ stored: number; skipped: number }>>(
      "/api/hr-direct-jobs/collect",
      payload ?? {}
    );
    return data.data;
  },

  async collectFromProfile() {
    const { data } = await api.post<ApiSuccessResponse<{ stored: number; skipped: number }>>(
      "/api/hr-direct-jobs/collect-profile"
    );
    return data.data;
  },

  async refreshMatch(id: string): Promise<HrDirectJob> {
    const { data } = await api.post<ApiSuccessResponse<HrDirectJob>>(
      `/api/hr-direct-jobs/${id}/match`
    );
    return data.data;
  },

  async generateResume(id: string) {
    const { data } = await api.post<ApiSuccessResponse<{ tailoredResumeText: string }>>(
      `/api/hr-direct-jobs/${id}/generate-resume`
    );
    return data.data;
  },

  async generateCoverLetter(id: string) {
    const { data } = await api.post<ApiSuccessResponse<{ coverLetter: string }>>(
      `/api/hr-direct-jobs/${id}/generate-cover-letter`
    );
    return data.data;
  },

  async sendEmail(id: string, payload?: { subject?: string; body?: string }) {
    const { data } = await api.post<
      ApiSuccessResponse<{ emailSentAt: string; subject: string; body: string }>
    >(`/api/hr-direct-jobs/${id}/send-email`, payload ?? {});
    return data.data;
  },
};
