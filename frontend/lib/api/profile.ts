import api from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { ProfileFormValues, ProfileResponse } from "@/lib/types/profile";

const toBody = (payload: Partial<ProfileFormValues>) => {
  const { email: _email, employmentType, ...rest } = payload;
  return {
    ...rest,
    employmentType: employmentType || undefined,
  };
};

export const profileApi = {
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get<ApiSuccessResponse<ProfileResponse>>("/api/profile");
    return data.data;
  },

  async saveProfile(payload: Omit<ProfileFormValues, "email">): Promise<ProfileResponse> {
    const { data } = await api.post<ApiSuccessResponse<ProfileResponse>>(
      "/api/profile",
      toBody(payload)
    );
    return data.data;
  },

  async patchProfile(payload: Partial<Omit<ProfileFormValues, "email">>): Promise<ProfileResponse> {
    const { data } = await api.patch<ApiSuccessResponse<ProfileResponse>>(
      "/api/profile",
      toBody(payload)
    );
    return data.data;
  },

  async uploadResume(payload: {
    resumeUrl: string;
    resumeName: string;
    resumeKey?: string;
  }): Promise<ProfileResponse> {
    const { data } = await api.post<ApiSuccessResponse<ProfileResponse>>(
      "/api/profile/upload-resume",
      payload
    );
    return data.data;
  },

  async deleteResume(): Promise<ProfileResponse> {
    const { data } = await api.delete<ApiSuccessResponse<ProfileResponse>>("/api/profile/resume");
    return data.data;
  },
};

export async function ensureProfileComplete(): Promise<ProfileResponse> {
  return profileApi.getProfile();
}

export function canAccessApp(profileStatus: ProfileResponse): boolean {
  return profileStatus.canAccessDashboard;
}
