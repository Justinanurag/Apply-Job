export const JOB_ROLE_PRESETS = [
  "React Developer",
  "Node Developer",
  "Full Stack Developer",
  "TypeScript Developer",
  "Python Developer",
  "Frontend Developer",
  "Backend Developer",
  "Java Developer",
] as const;

export const JOB_SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "naukri", label: "Naukri" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "wellfound", label: "Wellfound" },
] as const;
