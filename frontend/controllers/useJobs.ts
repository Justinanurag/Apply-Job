import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api/jobs";
import type { JobSearchPayload } from "@/lib/types/job";

export const JOBS_QUERY_KEY = ["jobs"];

export function useJobs(params?: {
  search?: string;
  source?: string;
  location?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...JOBS_QUERY_KEY, params],
    queryFn: () => jobsApi.list(params),
    staleTime: 1000 * 60,
  });
}

export function useJob(id: string | null) {
  return useQuery({
    queryKey: [...JOBS_QUERY_KEY, "detail", id],
    queryFn: () => jobsApi.getById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useJobSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JobSearchPayload) => jobsApi.search(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}

export function useCollectJobsFromProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => jobsApi.collectFromProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    },
  });
}
