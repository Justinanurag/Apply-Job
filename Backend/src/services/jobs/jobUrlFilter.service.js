const JOB_URL_PATTERNS = [
  /linkedin\.com\/jobs/i,
  /naukri\.com/i,
  /wellfound\.com/i,
  /indeed\.com/i,
  /glassdoor\.com/i,
  /\/jobs\//i,
  /\/job\//i,
  /\/job-/i,
  /\/careers\//i,
  /\/vacancy/i,
];

const BLOCKED_PATTERNS = [
  /\/company\//i,
  /\/companies\//i,
  /\/salary/i,
  /\/interview/i,
  /\/blog/i,
  /\/news/i,
];

export const detectSourceFromUrl = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("naukri")) return "naukri";
    if (host.includes("wellfound") || host.includes("angel.co")) return "wellfound";
    if (host.includes("indeed")) return "indeed";
    if (host.includes("glassdoor")) return "glassdoor";
    return host.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
};

export const isJobUrl = (link) => {
  if (!link || typeof link !== "string") return false;

  if (BLOCKED_PATTERNS.some((p) => p.test(link))) return false;

  return JOB_URL_PATTERNS.some((p) => p.test(link));
};

export const filterJobResults = (organic = []) =>
  organic
    .filter((item) => item?.link && isJobUrl(item.link))
    .map((item) => ({
      title: item.title ?? "",
      link: item.link,
      snippet: item.snippet ?? "",
    }));
