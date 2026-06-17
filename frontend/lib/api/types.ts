export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
