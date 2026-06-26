import { resolvePostedDate } from "../jobs/parsePostedDate.service.js";
import { extractEmailsFromText } from "./hrDirectFilter.service.js";
import { structureHrPostWithAI, isAiEnabled } from "../ai/openai.service.js";

const SKILL_KEYWORDS = [
  "React", "Node.js", "Next.js", "TypeScript", "JavaScript", "Python", "Java",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL", "Vue",
  "Angular", "Tailwind", "Go", "DevOps", "Full Stack", "Frontend", "Backend",
];

const parseTitleAndCompany = (title) => {
  let jobTitle = title?.trim() || "Open Position";
  let company = null;

  for (const sep of [" - ", " | ", " at ", " @ "]) {
    if (title?.includes(sep)) {
      const parts = title.split(sep).map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        jobTitle = parts[0];
        company = parts[1].replace(/\s*(LinkedIn|Hiring).*$/i, "").trim();
        break;
      }
    }
  }

  return { jobTitle, company };
};

const parseExperience = (text) => {
  const match = text.match(/(\d+\s*[-–]\s*\d+|\d+\+?)\s*(years?|yrs?)/i);
  return match ? match[0] : null;
};

const parseWorkMode = (text) => {
  if (/\bremote\b|\bwfh\b|\bwork from home\b/i.test(text)) return "remote";
  if (/\bhybrid\b/i.test(text)) return "hybrid";
  if (/\bonsite\b|\bon-site\b|\boffice\b/i.test(text)) return "onsite";
  return null;
};

const parseLocation = (text, fallback) => {
  const patterns = [
    /\b(Bangalore|Bengaluru|Mumbai|Delhi|Hyderabad|Pune|Chennai|Remote|India)\b/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return fallback ?? null;
};

const extractSkillsHeuristic = (text, roleKeyword) => {
  const found = SKILL_KEYWORDS.filter((skill) =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)
  );

  if (roleKeyword) {
    const kw = roleKeyword.replace(/\s+Developer$/i, "").trim();
    if (kw && !found.some((s) => s.toLowerCase() === kw.toLowerCase())) {
      found.unshift(kw);
    }
  }

  return [...new Set(found)].slice(0, 15);
};

const parseHrName = (text, email) => {
  const patterns = [
    /(?:contact|reach|email|send(?:\s+your)?\s+(?:cv|resume)\s+to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:HR|Recruiter|TALENT)\s*[-:]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  if (email) {
    const local = email.split("@")[0];
    if (/^[a-z]+[._][a-z]+$/i.test(local)) {
      return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  return null;
};

export const extractHrDirectJobHeuristic = (item, { roleKeyword, location, source }) => {
  const combined = `${item.title} ${item.snippet}`;
  const emails = extractEmailsFromText(combined);
  const hrEmail = item.hrEmail ?? emails[0];
  const { jobTitle, company } = parseTitleAndCompany(item.title);
  const { postedAt, postedText } = resolvePostedDate(item);

  return {
    title: jobTitle,
    company,
    location: parseLocation(combined, location),
    experienceRequired: parseExperience(combined),
    skills: extractSkillsHeuristic(combined, roleKeyword),
    hrName: parseHrName(combined, hrEmail),
    hrEmail,
    description: item.snippet?.trim() || null,
    sourceUrl: item.link,
    source: source ?? "linkedin",
    workMode: parseWorkMode(combined),
    postedAt,
    postedText,
    rawSnippet: item.snippet?.trim() || null,
    searchKeyword: roleKeyword ?? null,
  };
};

export const extractHrDirectJob = async (item, context) => {
  const heuristic = extractHrDirectJobHeuristic(item, context);

  if (!isAiEnabled()) return heuristic;

  try {
    const ai = await structureHrPostWithAI({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      searchKeyword: context.roleKeyword,
    });

    return {
      title: ai.title?.trim() || heuristic.title,
      company: ai.company?.trim() || heuristic.company,
      location: ai.location?.trim() || heuristic.location,
      experienceRequired: ai.experienceRequired?.trim() || heuristic.experienceRequired,
      skills: Array.isArray(ai.skills) && ai.skills.length ? ai.skills : heuristic.skills,
      hrName: ai.hrName?.trim() || heuristic.hrName,
      hrEmail: ai.hrEmail?.trim()?.toLowerCase() || heuristic.hrEmail,
      description: ai.description?.trim() || heuristic.description,
      sourceUrl: item.link,
      source: context.source ?? heuristic.source,
      workMode: ai.workMode && ai.workMode !== "unknown" ? ai.workMode : heuristic.workMode,
      postedAt: heuristic.postedAt,
      postedText: heuristic.postedText,
      rawSnippet: heuristic.rawSnippet,
      searchKeyword: context.roleKeyword ?? null,
    };
  } catch (error) {
    console.warn("AI extraction failed, using heuristic:", error.message);
    return heuristic;
  }
};
