import { detectSourceFromUrl } from "./jobUrlFilter.service.js";
import { resolvePostedDate } from "./parsePostedDate.service.js";

const SKILL_KEYWORDS = [
  "React", "Node.js", "Next.js", "TypeScript", "JavaScript", "Python", "Java",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL", "Vue",
  "Angular", "Tailwind", "CSS", "HTML", "Go", "Rust", "Swift", "Kotlin",
  "Machine Learning", "AI", "DevOps", "Full Stack", "Frontend", "Backend",
];

const parseTitleAndCompany = (title, url) => {
  let jobTitle = title?.trim() || "Job Opening";
  let company = null;

  const separators = [" - ", " | ", " at ", " @ "];
  for (const sep of separators) {
    if (title?.includes(sep)) {
      const parts = title.split(sep).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        jobTitle = parts[0];
        company = parts[1].replace(/\s*(LinkedIn|Naukri|Indeed|Glassdoor).*$/i, "").trim();
        break;
      }
    }
  }

  if (!company) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      const name = host.split(".")[0];
      company = name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      company = null;
    }
  }

  return { jobTitle, company };
};

const parseLocation = (title, snippet, fallbackLocation) => {
  const text = `${title} ${snippet}`;
  const remoteMatch = /\b(remote|work from home|wfh)\b/i.test(text);

  const locationPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*(?:India|[A-Z]{2}))\b/,
    /\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Pune|Chennai|Remote|India)\b/i,
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1] ?? match[0];
  }

  if (remoteMatch) return "Remote";
  return fallbackLocation ?? null;
};

const extractSkills = (text, keyword) => {
  const found = SKILL_KEYWORDS.filter((skill) =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );

  if (keyword) {
    const kw = keyword.replace(/\s+Developer$/i, "").trim();
    if (kw && !found.some((s) => s.toLowerCase() === kw.toLowerCase())) {
      found.unshift(kw);
    }
  }

  return [...new Set(found)].slice(0, 12);
};

export const extractJobFromSearchResult = (item, { keyword, location, source }) => {
  const { jobTitle, company } = parseTitleAndCompany(item.title, item.link);
  const combinedText = `${item.title} ${item.snippet}`;
  const { postedAt, postedText } = resolvePostedDate(item);

  return {
    title: jobTitle,
    company,
    location: parseLocation(item.title, item.snippet, location),
    source: source ?? detectSourceFromUrl(item.link),
    applyUrl: item.link,
    description: item.snippet?.trim() || null,
    snippet: item.snippet?.trim() || null,
    skills: extractSkills(combinedText, keyword),
    postedAt,
    postedText,
  };
};
