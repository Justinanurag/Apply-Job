import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HrDirectJob } from "@/lib/types/hrDirectJob";
import { getJobTimeInfo } from "@/lib/utils/jobDate";

interface HrDirectJobCardProps {
  job: HrDirectJob;
  selected?: boolean;
  onSelect: () => void;
}

function scoreColor(score: number | null) {
  if (score == null) return "text-muted-foreground";
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function HrDirectJobCard({ job, selected, onSelect }: HrDirectJobCardProps) {
  const timeInfo = getJobTimeInfo({
    postedAt: job.postedAt,
    postedText: job.postedText,
    createdAt: job.createdAt,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onSelect}
      className={`p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
        selected
          ? "bg-white/10 border-primary/40 ring-1 ring-primary/20"
          : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 min-w-0 flex-1">
          <div className="h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center text-primary-foreground font-bold text-xl shrink-0">
            {(job.company?.[0] ?? "H").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{job.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {job.company ?? "Company not listed"}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
              {job.location && (
                <span className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
              )}
              {job.experienceRequired && (
                <span className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                  <Briefcase className="h-3 w-3" /> {job.experienceRequired}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                <Mail className="h-3 w-3" /> {job.hrEmail}
              </span>
            </div>
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 4).map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px] bg-white/5 font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
            {job.missingSkills.length > 0 && (
              <p className="text-xs text-amber-400/90 mt-2">
                Missing: {job.missingSkills.slice(0, 3).join(", ")}
                {job.missingSkills.length > 3 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <div className={`text-2xl font-bold ${scoreColor(job.matchScore)}`}>
            {job.matchScore ?? "—"}%
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeInfo.relative}
          </div>
          {job.emailSentAt && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">
              Applied
            </Badge>
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 bg-white/5 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
