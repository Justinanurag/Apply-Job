import { format, formatDistanceToNow, isValid } from "date-fns";
import type { Job } from "@/lib/types/job";

export interface JobTimeInfo {
  /** Short label for list cards, e.g. "2 days ago" */
  relative: string;
  /** Full label for detail view, e.g. "Posted 2 days ago" */
  label: string;
  /** Whether this is the original posting date or when we discovered the job */
  kind: "posted" | "discovered";
  /** ISO date when available */
  date: string | null;
}

function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

function formatAbsolute(date: Date): string {
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function getJobTimeInfo(job: Pick<Job, "postedAt" | "postedText" | "createdAt">): JobTimeInfo {
  if (job.postedText) {
    const parsed = job.postedAt ? new Date(job.postedAt) : null;
    const relative = parsed && isValid(parsed) ? formatRelative(parsed) : job.postedText;
    const absolute = parsed && isValid(parsed) ? formatAbsolute(parsed) : job.postedText;

    return {
      relative,
      label: `Posted ${absolute}`,
      kind: "posted",
      date: job.postedAt,
    };
  }

  if (job.postedAt) {
    const date = new Date(job.postedAt);
    if (isValid(date)) {
      return {
        relative: formatRelative(date),
        label: `Posted ${formatAbsolute(date)}`,
        kind: "posted",
        date: job.postedAt,
      };
    }
  }

  if (job.createdAt) {
    const date = new Date(job.createdAt);
    return {
      relative: formatRelative(date),
      label: `Discovered ${formatAbsolute(date)}`,
      kind: "discovered",
      date: job.createdAt,
    };
  }

  return {
    relative: "Recently",
    label: "Recently discovered",
    kind: "discovered",
    date: null,
  };
}
