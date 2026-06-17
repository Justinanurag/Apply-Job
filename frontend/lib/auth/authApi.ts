import api from "@/lib/api/client";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/authStore";
import type { ApiSuccessResponse, LoginResponse, User } from "@/lib/api/types";

export const authApi = {
  async register(name: string, email: string, password: string): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<null>>("/api/auth/register", {
      name,
      email,
      password,
    });
    return data.message;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<ApiSuccessResponse<LoginResponse>>("/api/auth/login", {
      email,
      password,
    });
    setAccessToken(data.data.accessToken);
    return data.data;
  },

  async logout(): Promise<void> {
    try {
      if (getAccessToken()) {
        await api.post("/api/auth/logout");
      }
    } finally {
      clearAccessToken();
    }
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiSuccessResponse<{ user: User }>>("/api/auth/me");
    return data.data.user;
  },

  async refreshToken(): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<{ accessToken: string }>>(
      "/api/auth/refresh-token"
    );
    setAccessToken(data.data.accessToken);
    return data.data.accessToken;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<null>>("/api/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return data.message;
  },

  async forgotPassword(email: string): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<null>>("/api/auth/forgot-password", {
      email,
    });
    return data.message;
  },

  async verifyOtp(email: string, otp: string): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<{ resetToken: string }>>(
      "/api/auth/verify-otp",
      { email, otp }
    );
    return data.data.resetToken;
  },

  async resetPassword(resetToken: string, password: string): Promise<string> {
    const { data } = await api.post<ApiSuccessResponse<null>>("/api/auth/reset-password", {
      resetToken,
      password,
    });
    return data.message;
  },
};

export async function ensureAuthenticated(): Promise<User | null> {
  try {
    if (!getAccessToken()) {
      await authApi.refreshToken();
    }
    return await authApi.getMe();
  } catch {
    clearAccessToken();
    return null;
  }
}
