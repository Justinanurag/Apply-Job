import fs from "fs";
import mammoth from "mammoth";

const SKILL_KEYWORDS = [
  "React", "Node.js", "Next.js", "TypeScript", "JavaScript", "Python", "Java",
  "MongoDB", "PostgreSQL", "MySQL", "AWS", "Docker", "Kubernetes", "GraphQL",
  "Redis", "Express", "Vue", "Angular", "Tailwind", "CSS", "HTML", "Git",
  "C++", "C#", ".NET", "Go", "Golang", "Rust", "Swift", "Kotlin", "Flutter",
  "React Native", "SQL", "NoSQL", "Firebase", "Azure", "GCP", "Linux",
  "Machine Learning", "AI", "Data Science", "TensorFlow", "PyTorch",
];

const ROLE_KEYWORDS = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Software Engineer", "DevOps Engineer", "Data Scientist", "UI/UX Designer",
  "Mobile Developer", "Cloud Engineer", "Product Manager",
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const extractProfileFromText = (text) => {
  if (!text?.trim()) return {};

  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const emailMatch = normalized.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = normalized.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}\b/
  );
  const linkedInMatch = normalized.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/i
  );
  const githubMatch = normalized.match(/https?:\/\/(?:www\.)?github\.com\/[\w-]+/i);
  const portfolioMatch = normalized.match(/https?:\/\/(?!linkedin|github)[\w.-]+\.[a-z]{2,}(?:\/\S*)?/i);

  const expMatch =
    normalized.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i) ||
    normalized.match(/experience[:\s]+(\d+)\+?\s*(?:years?|yrs?)/i);

  const locationMatch =
    normalized.match(/(?:location|address|based in)[:\s]+([^\n]+)/i) ||
    normalized.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2,})\b/);

  const companyMatch = normalized.match(
    /(?:company|employer|organization)[:\s]+([^\n]+)/i
  );

  const skills = SKILL_KEYWORDS.filter((skill) =>
    new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(normalized)
  );

  let fullName = null;
  for (const line of lines.slice(0, 5)) {
    if (
      line.length >= 3 &&
      line.length <= 60 &&
      !line.includes("@") &&
      !/^(resume|curriculum|cv|phone|email|skills|experience|education|summary)/i.test(line) &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  let currentRole = null;
  for (const role of ROLE_KEYWORDS) {
    if (new RegExp(escapeRegex(role), "i").test(normalized)) {
      currentRole = role;
      break;
    }
  }

  const preferredRoles = ROLE_KEYWORDS.filter((role) =>
    new RegExp(escapeRegex(role), "i").test(normalized)
  ).slice(0, 3);

  const techStacks = [];
  if (/\b(frontend|front-end|react|vue|angular)\b/i.test(normalized)) techStacks.push("Frontend");
  if (/\b(backend|back-end|node|api|server)\b/i.test(normalized)) techStacks.push("Backend");
  if (/\b(full[\s-]?stack)\b/i.test(normalized)) techStacks.push("Full Stack");
  if (/\b(devops|ci\/cd|kubernetes|docker)\b/i.test(normalized)) techStacks.push("DevOps");
  if (/\b(aws|azure|gcp|cloud)\b/i.test(normalized)) techStacks.push("Cloud");
  if (/\b(machine learning|ai\/ml|data science)\b/i.test(normalized)) techStacks.push("AI/ML");

  let remotePreference = null;
  if (/\bremote\b/i.test(normalized)) remotePreference = "Remote";
  else if (/\bhybrid\b/i.test(normalized)) remotePreference = "Hybrid";
  else if (/\bonsite\b|\bon-site\b|\bin-office\b/i.test(normalized)) remotePreference = "Onsite";

  const preferredLocations = [];
  if (/\bremote\b/i.test(normalized)) preferredLocations.push("Remote");
  if (locationMatch?.[1]) preferredLocations.push(locationMatch[1].trim());

  return {
    fullName,
    phone: phoneMatch?.[0]?.trim() ?? null,
    location: locationMatch?.[1]?.trim() ?? null,
    currentRole,
    experience: expMatch ? Number(expMatch[1]) : null,
    linkedInUrl: linkedInMatch?.[0] ?? null,
    githubUrl: githubMatch?.[0] ?? null,
    portfolioUrl: portfolioMatch?.[0] ?? null,
    currentCompany: companyMatch?.[1]?.trim() ?? null,
    skills,
    techStacks: [...new Set(techStacks)],
    preferredRoles,
    preferredLocations: [...new Set(preferredLocations)],
    remotePreference,
  };
};

export const guessMimeFromName = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return "application/octet-stream";
};

export const parseResumeFile = async (fileUrl, mimetype) => {
  let text = "";
  
  // Fetch the file buffer from the URL
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch resume from URL: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (mimetype === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    text = data.text;
  } else {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }

  return extractProfileFromText(text);
};

export const mergeParsedIntoProfile = (existing, parsed) => {
  const mergeArray = (current, incoming) => {
    if (!incoming?.length) return current ?? [];
    return [...new Set([...(current ?? []), ...incoming])];
  };

  const pick = (key) => {
    const current = existing?.[key];
    const incoming = parsed?.[key];
    if (current != null && current !== "" && !(Array.isArray(current) && current.length === 0)) {
      return current;
    }
    return incoming ?? current ?? (Array.isArray(existing?.[key]) ? [] : null);
  };

  return {
    fullName: pick("fullName"),
    phone: pick("phone"),
    location: pick("location"),
    currentRole: pick("currentRole"),
    experience: pick("experience"),
    linkedInUrl: pick("linkedInUrl"),
    githubUrl: pick("githubUrl"),
    portfolioUrl: pick("portfolioUrl"),
    currentCompany: pick("currentCompany"),
    skills: mergeArray(existing?.skills, parsed?.skills),
    techStacks: mergeArray(existing?.techStacks, parsed?.techStacks),
    preferredRoles: mergeArray(existing?.preferredRoles, parsed?.preferredRoles),
    preferredLocations: mergeArray(existing?.preferredLocations, parsed?.preferredLocations),
    remotePreference: pick("remotePreference"),
  };
};
