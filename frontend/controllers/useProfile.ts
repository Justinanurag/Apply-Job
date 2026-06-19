import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api/profile";
import type { ProfileFormValues } from "@/lib/types/profile";

export const PROFILE_QUERY_KEY = ["profile"];

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileApi.getProfile(),
    staleTime: 1000 * 60,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProfileFormValues) => {
      const { email: _email, ...payload } = values;
      return profileApi.saveProfile(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
  });
}

export function usePatchProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: Partial<ProfileFormValues>) => {
      const { email: _email, ...payload } = values;
      return profileApi.patchProfile(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { resumeUrl: string; resumeName: string; resumeKey?: string }) =>
      profileApi.uploadResume(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileApi.deleteResume(),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    },
  });
}
