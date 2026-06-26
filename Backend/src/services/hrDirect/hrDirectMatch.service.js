import {
  matchJobToProfileWithAI,
  generateTailoredResumeWithAI,
  generateCoverLetterWithAI,
  generateRecruiterEmailWithAI,
  isAiEnabled,
} from "../ai/openai.service.js";
import { fetchResumeTextFromUrl } from "../resumeText.service.js";

const normalize = (s) => s?.toLowerCase().trim() ?? "";

const computeHeuristicMatch = (job, profile) => {
  const profileSkills = new Set([
    ...(profile?.skills ?? []),
    ...(profile?.techStacks ?? []),
  ].map(normalize));

  const jobSkills = (job.skills ?? []).map(normalize);
  const matched = jobSkills.filter((s) =>
    [...profileSkills].some((ps) => ps.includes(s) || s.includes(ps))
  );
  const missingSkills = jobSkills.filter((s) => !matched.includes(s));

  let score = 40;
  if (jobSkills.length > 0) {
    score = Math.round(40 + (matched.length / jobSkills.length) * 50);
  } else if (profileSkills.size > 0) {
    score = 55;
  }

  const roleMatch =
    profile?.preferredRoles?.some((r) =>
      normalize(job.title).includes(normalize(r)) ||
      normalize(r).includes(normalize(job.title))
    ) ||
    (profile?.currentRole &&
      normalize(job.title).includes(normalize(profile.currentRole)));

  if (roleMatch) score = Math.min(100, score + 15);

  const locationMatch =
    profile?.preferredLocations?.some((l) =>
      normalize(job.location).includes(normalize(l))
    ) || normalize(job.location).includes(normalize(profile?.location));

  if (locationMatch) score = Math.min(100, score + 10);

  const matchReason =
    matched.length > 0
      ? `You match ${matched.length} of ${jobSkills.length || "several"} required skills${roleMatch ? " and your target role aligns" : ""}.`
      : "Limited skill overlap — review the description and highlight transferable experience.";

  return {
    matchScore: Math.min(100, Math.max(0, score)),
    missingSkills: missingSkills.slice(0, 10),
    matchReason,
  };
};

export const buildProfileSummary = (profile, user) => ({
  name: profile?.fullName ?? user?.name,
  email: user?.email,
  phone: profile?.phone,
  location: profile?.location,
  currentRole: profile?.currentRole,
  experience: profile?.experience,
  skills: profile?.skills ?? [],
  techStacks: profile?.techStacks ?? [],
  preferredRoles: profile?.preferredRoles ?? [],
  preferredLocations: profile?.preferredLocations ?? [],
  remotePreference: profile?.remotePreference,
});

const buildHeuristicCoverLetter = (job, profileSummary) =>
  `Dear ${job.hrName ?? "Hiring Manager"},

I am writing to apply for the ${job.title} position${job.company ? ` at ${job.company}` : ""}. As a ${profileSummary.currentRole ?? "developer"} with skills in ${(profileSummary.skills ?? []).slice(0, 6).join(", ")}, I am confident I can contribute effectively to your team.

${job.location ? `I am interested in this ${job.location} opportunity` : "I am excited about this opportunity"} and have hands-on experience with the technologies mentioned in your posting. I would welcome the chance to discuss how my background aligns with your requirements.

Thank you for your time and consideration. I have attached my resume for your review.

Best regards,
${profileSummary.name}
${profileSummary.phone ?? ""}
${profileSummary.email ?? ""}`.trim();

const buildHeuristicRecruiterEmail = (job, profileSummary, coverLetter) => ({
  subject: `Application: ${job.title}${job.company ? ` — ${job.company}` : ""}`,
  body: `Dear ${job.hrName ?? "Hiring Manager"},

Please find my resume attached for the ${job.title} position.

${coverLetter ?? `I believe my experience in ${(profileSummary.skills ?? []).slice(0, 4).join(", ")} makes me a strong candidate.`}

Best regards,
${profileSummary.name}
${profileSummary.phone ?? ""}`,
});

export const matchHrJobToUser = async ({ job, profile, user }) => {
  const profileSummary = buildProfileSummary(profile, user);
  let resumeText = "";

  if (profile?.resumeUrl) {
    try {
      resumeText = await fetchResumeTextFromUrl(profile.resumeUrl);
    } catch {
      resumeText = "";
    }
  }

  if (isAiEnabled()) {
    try {
      const ai = await matchJobToProfileWithAI({
        job: {
          title: job.title,
          company: job.company,
          location: job.location,
          experienceRequired: job.experienceRequired,
          skills: job.skills,
          description: job.description,
        },
        profile: profileSummary,
        resumeText,
      });

      return {
        matchScore: Math.min(100, Math.max(0, Number(ai.matchScore) || 0)),
        missingSkills: Array.isArray(ai.missingSkills) ? ai.missingSkills : [],
        matchReason: ai.matchReason ?? "",
      };
    } catch (error) {
      console.warn("AI match failed, using heuristic:", error.message);
    }
  }

  return computeHeuristicMatch(job, profile);
};

export const generateTailoredResume = async ({ job, profile, user }) => {
  const profileSummary = buildProfileSummary(profile, user);
  const resumeText = profile?.resumeUrl
    ? await fetchResumeTextFromUrl(profile.resumeUrl).catch(() => "")
    : "";

  if (isAiEnabled()) {
    try {
      const result = await generateTailoredResumeWithAI({
        job,
        profile: profileSummary,
        resumeText,
      });
      if (result.tailoredResumeText?.trim()) {
        return result.tailoredResumeText;
      }
    } catch (error) {
      console.warn("AI tailored resume failed, using profile resume:", error.message);
    }
  }

  return `TAILORED RESUME FOR: ${job.title}${job.company ? ` at ${job.company}` : ""}

${resumeText || "Upload a resume in Settings to generate a tailored version."}`;
};

export const generateCoverLetter = async ({ job, profile, user }) => {
  const profileSummary = buildProfileSummary(profile, user);
  const resumeText = profile?.resumeUrl
    ? await fetchResumeTextFromUrl(profile.resumeUrl).catch(() => "")
    : "";

  if (isAiEnabled()) {
    try {
      const result = await generateCoverLetterWithAI({
        job,
        profile: profileSummary,
        resumeText,
      });
      if (result.coverLetter?.trim()) {
        return result.coverLetter;
      }
    } catch (error) {
      console.warn("AI cover letter failed, using template:", error.message);
    }
  }

  return buildHeuristicCoverLetter(job, profileSummary);
};

export const generateRecruiterEmail = async ({ job, profile, user, coverLetter }) => {
  const profileSummary = buildProfileSummary(profile, user);

  if (isAiEnabled()) {
    try {
      const result = await generateRecruiterEmailWithAI({
        job,
        profile: profileSummary,
        coverLetter,
      });
      return {
        subject: result.subject ?? `Application for ${job.title}`,
        body: result.body ?? coverLetter ?? "",
      };
    } catch (error) {
      console.warn("AI recruiter email failed, using template:", error.message);
    }
  }

  return buildHeuristicRecruiterEmail(job, profileSummary, coverLetter);
};
