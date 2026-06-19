import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Loader2,
  RefreshCw,
  Clock,
  Filter,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { JobDetailPanel } from "@/views/components/jobs/JobDetailPanel";
import { JobFilters, type JobFiltersState } from "@/views/components/jobs/JobFilters";
import { JobSearchBar } from "@/views/components/jobs/JobSearchBar";
import { JobPageHeader } from "@/views/components/jobs/JobPageHeader";
import { useJobs, useJob, useJobSearch, useCollectJobsFromProfile } from "@/controllers/useJobs";
import { notify } from "@/lib/alerts";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Job, JobListItem } from "@/lib/types/job";
import { getJobTimeInfo } from "@/lib/utils/jobDate";

export const Route = createFileRoute("/_app/jobs")({
  component: JobDiscoveryPage,
});

function toListItem(job: Job): JobListItem {
  const timeInfo = getJobTimeInfo(job);
  return {
    ...job,
    requiredSkills: job.skills ?? [],
    missingSkills: [],
    match: undefined,
    atsScore: undefined,
    type: "Full-time",
    salary: undefined,
    postedAt: timeInfo.relative,
    postedLabel: timeInfo.label,
    postedKind: timeInfo.kind,
  };
}

function JobDiscoveryPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filters, setFilters] = useState<JobFiltersState>({
    keyword: "",
    location: "",
    source: "all",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading, isError, refetch } = useJobs({
    search: debouncedFilters.keyword.trim() || undefined,
    location: debouncedFilters.location.trim() || undefined,
    source: debouncedFilters.source !== "all" ? debouncedFilters.source : undefined,
    limit: 50,
  });
  const { data: selectedJob, isLoading: isJobLoading } = useJob(selectedJobId);
  const searchJobs = useJobSearch();
  const collectProfile = useCollectJobsFromProfile();

  const jobs = (data?.jobs ?? []).map(toListItem);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      notify.error("Enter a job keyword to search");
      return;
    }

    const toastId = notify.loading("Searching Google Jobs via Serper...");
    try {
      const result = await searchJobs.mutateAsync({
        keyword: searchKeyword.trim(),
        location: searchLocation.trim() || undefined,
      });
      notify.dismiss(toastId);
      notify.success(`Stored ${result.stored} new jobs (${result.skipped} duplicates skipped)`);
      await refetch();
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Job search failed"));
    }
  };

  const handleCollectFromProfile = async () => {
    const toastId = notify.loading("Collecting jobs from your profile skills...");
    try {
      const result = await collectProfile.mutateAsync();
      notify.dismiss(toastId);
      notify.success(`Collected ${result.stored} new jobs from your profile`);
      await refetch();
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Profile collection failed"));
    }
  };

  const hasActiveFilters =
    Boolean(debouncedFilters.keyword.trim()) ||
    Boolean(debouncedFilters.location.trim()) ||
    debouncedFilters.source !== "all";

  return (
    <div className="flex h-full gap-6 lg:gap-8">
      {/* Desktop sidebar filters */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0">
        <div className="sticky top-0 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pr-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Refine results
          </p>
          <JobFilters
            filters={filters}
            onChange={setFilters}
            resultCount={data?.pagination.total}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <JobPageHeader
          onProfileMatch={() => void handleCollectFromProfile()}
          isProfileMatching={collectProfile.isPending}
        />

        <JobSearchBar
          keyword={searchKeyword}
          location={searchLocation}
          onKeywordChange={setSearchKeyword}
          onLocationChange={setSearchLocation}
          onSearch={() => void handleSearch()}
          onRefresh={() => void refetch()}
          isSearching={searchJobs.isPending}
          isRefreshing={isLoading}
        />

        {/* Mobile / tablet filters */}
        <div className="lg:hidden mt-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-11 bg-white/5 border-white/10 justify-between"
              >
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter saved jobs
                </span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(100vw-2rem,360px)] p-6 bg-background/95 backdrop-blur-xl border-r border-white/10"
            >
              <JobFilters
                filters={filters}
                onChange={setFilters}
                resultCount={data?.pagination.total}
              />
            </SheetContent>
          </Sheet>
        </div>

        {data?.pagination.total !== undefined && (
          <p className="text-xs text-muted-foreground mt-4 mb-2">
            Showing {jobs.length} of {data.pagination.total} jobs
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar pb-10 mt-2">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/5 bg-white/5 animate-pulse flex gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                      <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center flex flex-col items-center">
              <RefreshCw className="h-10 w-10 text-destructive mb-3" />
              <h3 className="font-semibold text-lg text-destructive">Failed to load jobs</h3>
              <p className="text-sm text-destructive/80 mt-1">Try searching to collect new listings or refresh the page.</p>
              <Button onClick={() => void refetch()} variant="outline" className="mt-4 border-destructive/30 text-destructive hover:bg-destructive/20">Try Again</Button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                 <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {hasActiveFilters ? "No jobs match your filters" : "No jobs found"}
              </h3>
              <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or clear your filters to see more results."
                  : "Start by searching for a role like 'React Developer' to collect jobs from various sources."}
              </p>
              {hasActiveFilters ? (
                <Button onClick={() => setFilters({ keyword: "", location: "", source: "all" })} variant="secondary">
                  Clear Filters
                </Button>
              ) : (
                <Button
                  onClick={() => setSearchKeyword("React Developer")}
                  className="bg-gradient-brand border-0"
                >
                  Start Searching
                </Button>
              )}
            </div>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-lg ${
                  selectedJobId === job.id
                    ? "bg-white/10 border-primary/50 shadow-md ring-1 ring-primary/20"
                    : "bg-white/5 hover:bg-white/10 border-white/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                  <div className="flex gap-4 min-w-0 w-full sm:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-brand shadow-sm grid place-items-center text-primary-foreground font-bold text-xl shrink-0">
                      {(job.company?.[0] ?? job.source[0] ?? "J").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="text-muted-foreground text-sm mt-1 font-medium truncate">
                        {job.company ?? "Company not listed"}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-3 text-xs text-muted-foreground">
                        {job.location && (
                          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5 max-w-full">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 capitalize bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{job.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/5">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span title={job.postedLabel} className="truncate max-w-[120px]">
                        {job.postedKind === "posted" ? "Posted" : "Found"}{" "}
                        {job.postedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {(job.description || job.snippet) && (
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed">
                    {job.description ?? job.snippet}
                  </p>
                )}

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                    {job.requiredSkills.slice(0, 5).map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="bg-white/5 hover:bg-white/10 transition-colors text-[11px] font-medium text-muted-foreground border-white/5 px-2 py-0.5"
                      >
                        {s}
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="text-[11px] text-muted-foreground font-medium pl-1">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Job Detail Sheet (All screen sizes) */}
      <Sheet open={Boolean(selectedJobId)} onOpenChange={(open) => !open && setSelectedJobId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[480px] p-0 border-white/10 bg-background/95 backdrop-blur-xl flex flex-col [&>button.absolute]:hidden shadow-2xl"
        >
          <JobDetailPanel
            job={selectedJob}
            isLoading={isJobLoading}
            onClose={() => setSelectedJobId(null)}
            className="h-full"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
