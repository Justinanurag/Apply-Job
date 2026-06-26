import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hrDirectJobsApi } from "@/lib/api/hrDirectJobs";
import type { HrDirectFilters } from "@/lib/types/hrDirectJob";

export const HR_DIRECT_JOBS_KEY = ["hr-direct-jobs"];

export function useHrDirectJobs(params?: HrDirectFilters) {
  return useQuery({
    queryKey: [...HR_DIRECT_JOBS_KEY, params],
    queryFn: () => hrDirectJobsApi.list(params),
    staleTime: 1000 * 60,
  });
}

export function useHrDirectJob(id: string | null) {
  return useQuery({
    queryKey: [...HR_DIRECT_JOBS_KEY, "detail", id],
    queryFn: () => hrDirectJobsApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCollectHrDirectJobs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hrDirectJobsApi.collect,
    onSuccess: () => qc.invalidateQueries({ queryKey: HR_DIRECT_JOBS_KEY }),
  });
}

export function useCollectHrDirectFromProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hrDirectJobsApi.collectFromProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: HR_DIRECT_JOBS_KEY }),
  });
}

export function useHrDirectJobActions(id: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: HR_DIRECT_JOBS_KEY });
    qc.invalidateQueries({ queryKey: [...HR_DIRECT_JOBS_KEY, "detail", id] });
  };

  const generateResume = useMutation({
    mutationFn: () => hrDirectJobsApi.generateResume(id),
    onSuccess: invalidate,
  });

  const generateCoverLetter = useMutation({
    mutationFn: () => hrDirectJobsApi.generateCoverLetter(id),
    onSuccess: invalidate,
  });

  const sendEmail = useMutation({
    mutationFn: (payload?: { subject?: string; body?: string }) =>
      hrDirectJobsApi.sendEmail(id, payload),
    onSuccess: invalidate,
  });

  const refreshMatch = useMutation({
    mutationFn: () => hrDirectJobsApi.refreshMatch(id),
    onSuccess: invalidate,
  });

  return { generateResume, generateCoverLetter, sendEmail, refreshMatch };
}
