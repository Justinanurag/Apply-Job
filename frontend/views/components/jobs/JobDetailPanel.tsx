import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/alerts";
import { getJobTimeInfo } from "@/lib/utils/jobDate";
import type { Job } from "@/lib/types/job";

interface JobDetailPanelProps {
  job?: Job;
  isLoading?: boolean;
  onClose: () => void;
  className?: string;
}

export function JobDetailPanel({ job, isLoading, onClose, className = "" }: JobDetailPanelProps) {
  const copyApplyLink = async () => {
    if (!job?.applyUrl) return;
    try {
      await navigator.clipboard.writeText(job.applyUrl);
      notify.success("Apply link copied");
    } catch {
      notify.error("Could not copy link");
    }
  };

  const timeInfo = job ? getJobTimeInfo(job) : null;
  const description = job?.description?.trim() || job?.snippet?.trim() || null;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background/50 backdrop-blur-md z-10 shrink-0">
        <h2 className="font-medium">Job Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading job details...
          </div>
        ) : !job ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Select a job to view details
          </div>
        ) : (
          <>
            <div className="flex flex-col mb-8 mt-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-brand shadow-sm grid place-items-center text-primary-foreground font-bold text-2xl shrink-0">
                  {(job.company?.[0] ?? job.source[0] ?? "J").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold tracking-tight leading-tight mb-1">{job.title}</h2>
                  <div className="text-base text-muted-foreground font-medium">
                    {job.company ?? "Company not listed"}
                  </div>
                </div>
              </div>

              {timeInfo && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 border border-white/5 w-fit px-3 py-1.5 rounded-full">
                  <Clock className="h-3.5 w-3.5" />
                  {timeInfo.label}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-sm transition-all hover:bg-white/10">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Source</div>
                <div className="text-base font-semibold capitalize">{job.source}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-sm transition-all hover:bg-white/10">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> Location
                </div>
                <div className="text-base font-semibold truncate">{job.location ?? "Not specified"}</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-sm sm:col-span-2 transition-all hover:bg-white/10">
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {timeInfo?.kind === "posted" ? "Job Posted" : "Discovered"}
                </div>
                <div className="text-base font-semibold">{timeInfo?.label ?? "—"}</div>
                {timeInfo?.kind === "posted" && job.createdAt && (
                  <div className="text-sm text-muted-foreground mt-2 border-t border-white/10 pt-2">
                    Added to database{" "}
                    <span className="font-medium text-foreground">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>

            {job.skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                  <Star className="h-5 w-5 text-yellow-400" /> Skills & Requirements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-white/5 border-white/10 hover:bg-white/10 px-3 py-1 text-sm font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Briefcase className="h-5 w-5 text-primary" /> Job Description
              </h3>
              {description ? (
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-2xl border border-white/5">
                  {description}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  No description available yet. Use the apply link to view the full posting on{" "}
                  {job.source}.
                </div>
              )}
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <ExternalLink className="h-5 w-5 text-primary" /> Application Link
              </h3>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 flex items-center">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary break-all hover:underline font-medium"
                >
                  {job.applyUrl}
                </a>
              </div>
            </section>
          </>
        )}
      </div>

      {job && !isLoading && (
        <div className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-md sticky bottom-0 shrink-0 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10"
            onClick={() => void copyApplyLink()}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy link
          </Button>
          <Button className="bg-gradient-brand text-primary-foreground border-0 shadow-glow hover:opacity-90" asChild>
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply now
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
