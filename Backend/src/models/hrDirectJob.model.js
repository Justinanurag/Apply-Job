import { prisma } from "../config/db.js";

export const findHrDirectJobById = (id) =>
  prisma.hrDirectJob.findUnique({ where: { id } });

export const findHrDirectJobBySourceUrl = (sourceUrl) =>
  prisma.hrDirectJob.findUnique({ where: { sourceUrl } });

export const createHrDirectJobIfNotExists = async (data) => {
  const existing = await findHrDirectJobBySourceUrl(data.sourceUrl);
  if (existing) return { job: existing, created: false };

  const job = await prisma.hrDirectJob.create({ data });
  return { job, created: true };
};

export const upsertHrDirectJobMatch = (userId, hrDirectJobId, matchData) => {
  const base = {
    matchScore: matchData.matchScore ?? 0,
    missingSkills: matchData.missingSkills ?? [],
    matchReason: matchData.matchReason ?? null,
    tailoredResumeText: matchData.tailoredResumeText ?? null,
    coverLetter: matchData.coverLetter ?? null,
    recruiterEmailBody: matchData.recruiterEmailBody ?? null,
    emailSentAt: matchData.emailSentAt ?? null,
  };

  return prisma.hrDirectJobMatch.upsert({
    where: { userId_hrDirectJobId: { userId, hrDirectJobId } },
    create: { userId, hrDirectJobId, ...base },
    update: base,
  });
};

export const findHrDirectJobMatch = (userId, hrDirectJobId) =>
  prisma.hrDirectJobMatch.findUnique({
    where: { userId_hrDirectJobId: { userId, hrDirectJobId } },
  });

export const updateHrDirectJobMatch = (userId, hrDirectJobId, data) =>
  prisma.hrDirectJobMatch.update({
    where: { userId_hrDirectJobId: { userId, hrDirectJobId } },
    data,
  });

export const listHrDirectJobsForUser = async ({
  userId,
  search,
  location,
  source,
  minMatchScore,
  workMode,
  experience,
  page = 1,
  limit = 20,
}) => {
  const where = {};

  if (source) where.source = source;
  if (location?.trim()) {
    where.location = { contains: location.trim(), mode: "insensitive" };
  }
  if (workMode && workMode !== "all") {
    where.workMode = workMode;
  }
  if (experience?.trim()) {
    where.experienceRequired = { contains: experience.trim(), mode: "insensitive" };
  }
  if (search?.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { company: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { hrName: { contains: term, mode: "insensitive" } },
      { skills: { has: term } },
    ];
  }

  const skip = (page - 1) * limit;

  const [jobs, total] = await prisma.$transaction([
    prisma.hrDirectJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        matches: {
          where: { userId },
          take: 1,
        },
      },
    }),
    prisma.hrDirectJob.count({ where }),
  ]);

  let results = jobs.map((job) => toHrDirectJobWithMatchJSON(job, job.matches[0]));

  if (minMatchScore != null && minMatchScore > 0) {
    results = results.filter((j) => (j.matchScore ?? 0) >= minMatchScore);
  }

  results.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  return [results, total];
};

export const toHrDirectJobJSON = (job) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  experienceRequired: job.experienceRequired,
  skills: job.skills ?? [],
  hrName: job.hrName,
  hrEmail: job.hrEmail,
  description: job.description,
  sourceUrl: job.sourceUrl,
  source: job.source,
  workMode: job.workMode,
  postedAt: job.postedAt,
  postedText: job.postedText,
  searchKeyword: job.searchKeyword,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

export const toHrDirectJobWithMatchJSON = (job, match) => ({
  ...toHrDirectJobJSON(job),
  matchScore: match?.matchScore ?? null,
  missingSkills: match?.missingSkills ?? [],
  matchReason: match?.matchReason ?? null,
  tailoredResumeText: match?.tailoredResumeText ?? null,
  coverLetter: match?.coverLetter ?? null,
  recruiterEmailBody: match?.recruiterEmailBody ?? null,
  emailSentAt: match?.emailSentAt ?? null,
});
