import {
  Briefcase,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Sparkles,
  Star,
  X,
  FileText,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { HrDirectJob } from "@/lib/types/hrDirectJob";
import { getJobTimeInfo } from "@/lib/utils/jobDate";

interface HrDirectDetailPanelProps {
  job?: HrDirectJob;
  isLoading?: boolean;
  onClose: () => void;
  onGenerateResume: () => void;
  onGenerateCoverLetter: () => void;
  onSendEmail: () => void;
  isGeneratingResume?: boolean;
  isGeneratingCover?: boolean;
  isSendingEmail?: boolean;
}

function MatchScoreRing({ score }: { score: number | null }) {
  const value = score ?? 0;
  const color =
    value >= 75 ? "text-emerald-400" : value >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 ${color}`}>
      <span className="text-3xl font-bold">{value}%</span>
      <span className="text-xs text-muted-foreground mt-1">Match Score</span>
    </div>
  );
}

export function HrDirectDetailPanel({
  job,
  isLoading,
  onClose,
  onGenerateResume,
  onGenerateCoverLetter,
  onSendEmail,
  isGeneratingResume,
  isGeneratingCover,
  isSendingEmail,
}: HrDirectDetailPanelProps) {
  const timeInfo = job
    ? getJobTimeInfo({
        postedAt: job.postedAt,
        postedText: job.postedText,
        createdAt: job.createdAt,
      })
    : null;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <h2 className="font-semibold">HR Direct Apply</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading...
          </div>
        ) : !job ? (
          <p className="text-center text-muted-foreground py-20 text-sm">Select a job</p>
        ) : (
          <>
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold leading-tight">{job.title}</h3>
                <p className="text-muted-foreground mt-1">{job.company ?? "Company not listed"}</p>
                {timeInfo && (
                  <p className="text-xs text-muted-foreground mt-2">{timeInfo.label}</p>
                )}
              </div>
              <MatchScoreRing score={job.matchScore} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium mt-1">{job.location ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="text-sm font-medium mt-1">{job.experienceRequired ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">Work mode</p>
                <p className="text-sm font-medium mt-1 capitalize">{job.workMode ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-muted-foreground">HR Email</p>
                <a href={`mailto:${job.hrEmail}`} className="text-sm font-medium mt-1 text-primary break-all hover:underline block">
                  {job.hrEmail}
                </a>
              </div>
            </div>

            {job.matchReason && (
              <section>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Why this match
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{job.matchReason}</p>
              </section>
            )}

            {job.skills.length > 0 && (
              <section>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" /> Required skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="bg-white/10">
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {job.missingSkills.length > 0 && (
              <section>
                <h4 className="font-medium mb-2 text-amber-400">Missing skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.missingSkills.map((s) => (
                    <Badge key={s} variant="outline" className="border-amber-500/30 text-amber-400">
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Description
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {job.description ?? "No description available."}
              </p>
            </section>

            {job.coverLetter && (
              <section>
                <h4 className="font-medium mb-2">Cover letter</h4>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-white/5 p-3 rounded-xl border border-white/10">
                  {job.coverLetter}
                </pre>
              </section>
            )}

            {job.tailoredResumeText && (
              <section>
                <h4 className="font-medium mb-2">Tailored resume</h4>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-white/5 p-3 rounded-xl border border-white/10 max-h-48 overflow-y-auto">
                  {job.tailoredResumeText}
                </pre>
              </section>
            )}

            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View original post
            </a>
          </>
        )}
      </div>

      {job && !isLoading && (
        <div className="p-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5"
            onClick={onGenerateResume}
            disabled={isGeneratingResume}
          >
            {isGeneratingResume ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Tailored Resume
          </Button>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5"
            onClick={onGenerateCoverLetter}
            disabled={isGeneratingCover}
          >
            {isGeneratingCover ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Cover Letter
          </Button>
          <Button
            className="bg-gradient-brand text-primary-foreground border-0"
            onClick={onSendEmail}
            disabled={isSendingEmail || Boolean(job.emailSentAt)}
          >
            {isSendingEmail ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {job.emailSentAt ? "Email Sent" : "Send to HR"}
          </Button>
        </div>
      )}
    </div>
  );
}
