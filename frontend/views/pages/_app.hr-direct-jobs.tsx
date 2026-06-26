import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Search, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HrDirectJobCard } from "@/views/components/hrDirect/HrDirectJobCard";
import { HrDirectDetailPanel } from "@/views/components/hrDirect/HrDirectDetailPanel";
import { HrDirectFiltersPanel } from "@/views/components/hrDirect/HrDirectFiltersPanel";
import {
  useHrDirectJobs,
  useHrDirectJob,
  useCollectHrDirectJobs,
  useCollectHrDirectFromProfile,
  useHrDirectJobActions,
} from "@/controllers/useHrDirectJobs";
import { notify } from "@/lib/alerts";
import { getApiErrorMessage } from "@/lib/api/client";

export const Route = createFileRoute("/_app/hr-direct-jobs")({
  component: HrDirectApplyJobsPage,
});

type LocalFilters = {
  search: string;
  location: string;
  source: string;
  workMode: "all" | "remote" | "onsite" | "hybrid";
  experience: string;
  minMatchScore: number;
};

const defaultFilters: LocalFilters = {
  search: "",
  location: "",
  source: "all",
  workMode: "all",
  experience: "",
  minMatchScore: 0,
};

function HrDirectApplyJobsPage() {
  const [collectKeyword, setCollectKeyword] = useState("");
  const [filters, setFilters] = useState<LocalFilters>(defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilters(filters), 300);
    return () => clearTimeout(t);
  }, [filters]);

  const { data, isLoading, refetch } = useHrDirectJobs({
    search: debouncedFilters.search.trim() || undefined,
    location: debouncedFilters.location.trim() || undefined,
    source: debouncedFilters.source !== "all" ? debouncedFilters.source : undefined,
    workMode: debouncedFilters.workMode,
    experience: debouncedFilters.experience.trim() || undefined,
    minMatchScore: debouncedFilters.minMatchScore || undefined,
    limit: 50,
  });

  const { data: selectedJob, isLoading: detailLoading } = useHrDirectJob(selectedId);
  const actions = useHrDirectJobActions(selectedId ?? "");
  const collect = useCollectHrDirectJobs();
  const collectProfile = useCollectHrDirectFromProfile();

  const jobs = data?.jobs ?? [];
  const busy = collect.isPending || collectProfile.isPending;

  const handleCollect = async () => {
    const toastId = notify.loading("Searching HR hiring posts with emails...");
    try {
      const result = await collect.mutateAsync({
        keyword: collectKeyword.trim() || "Software Developer",
      });
      notify.dismiss(toastId);
      notify.success(`Collected ${result.stored} new HR posts`);
      await refetch();
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Collection failed"));
    }
  };

  const handleProfileCollect = async () => {
    const toastId = notify.loading("Collecting from your profile...");
    try {
      const result = await collectProfile.mutateAsync();
      notify.dismiss(toastId);
      notify.success(`Collected ${result.stored} HR posts`);
      await refetch();
    } catch (err) {
      notify.dismiss(toastId);
      notify.error(getApiErrorMessage(err, "Profile collection failed"));
    }
  };

  return (
    <div className="flex h-full gap-6 lg:gap-8">
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
        <HrDirectFiltersPanel
          filters={filters}
          onChange={setFilters}
          resultCount={data?.pagination.total}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">HR Direct Apply Jobs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recruiter posts with direct HR emails — apply instantly with AI-tailored materials.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 shrink-0"
            onClick={() => void handleProfileCollect()}
            disabled={busy}
          >
            {collectProfile.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
            )}
            Collect from Profile
          </Button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex flex-col md:flex-row gap-2 mb-4">
          <Input
            className="bg-white/5 border-white/10 md:flex-1"
            placeholder="Search hiring posts e.g. React Developer"
            value={collectKeyword}
            onChange={(e) => setCollectKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleCollect()}
          />
          <div className="flex gap-2">
            <Button
              className="flex-1 md:flex-none bg-gradient-brand text-primary-foreground border-0"
              onClick={() => void handleCollect()}
              disabled={busy}
            >
              {collect.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Discover HR Posts
            </Button>
            <Button variant="outline" size="icon" className="border-white/10" onClick={() => void refetch()}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full border-white/10 bg-white/5">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100vw-2rem,360px)] p-4">
              <HrDirectFiltersPanel
                filters={filters}
                onChange={setFilters}
                resultCount={data?.pagination.total}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar pb-10">
          {isLoading ? (
            <div className="flex justify-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading HR jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <p className="font-medium">No HR direct apply jobs yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click &quot;Discover HR Posts&quot; to find recruiter emails from LinkedIn and other sources.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <HrDirectJobCard
                key={job.id}
                job={job}
                selected={selectedId === job.id}
                onSelect={() => setSelectedId(job.id)}
              />
            ))
          )}
        </div>
      </div>

      <Sheet open={Boolean(selectedId)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[520px] p-0 border-white/10 [&>button.absolute]:hidden"
        >
          <HrDirectDetailPanel
            job={selectedJob}
            isLoading={detailLoading}
            onClose={() => setSelectedId(null)}
            onGenerateResume={() => {
              if (!selectedId) return;
              actions.generateResume.mutate(undefined, {
                onSuccess: () => notify.success("Tailored resume generated"),
                onError: (e) => notify.error(getApiErrorMessage(e, "Failed to generate resume")),
              });
            }}
            onGenerateCoverLetter={() => {
              if (!selectedId) return;
              actions.generateCoverLetter.mutate(undefined, {
                onSuccess: () => notify.success("Cover letter generated"),
                onError: (e) => notify.error(getApiErrorMessage(e, "Failed to generate cover letter")),
              });
            }}
            onSendEmail={() => {
              if (!selectedId) return;
              actions.sendEmail.mutate(undefined, {
                onSuccess: () => notify.success("Application email sent to HR"),
                onError: (e) => notify.error(getApiErrorMessage(e, "Failed to send email")),
              });
            }}
            isGeneratingResume={actions.generateResume.isPending}
            isGeneratingCover={actions.generateCoverLetter.isPending}
            isSendingEmail={actions.sendEmail.isPending}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
