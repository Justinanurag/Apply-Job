import { prisma } from "../config/db.js";

export const findJobById = (id) => prisma.job.findUnique({ where: { id } });

export const findJobByApplyUrl = (applyUrl) =>
  prisma.job.findUnique({ where: { applyUrl } });

export const listJobs = ({ search, source, location, page = 1, limit = 50 }) => {
  const where = {};

  if (source) where.source = source;

  if (location?.trim()) {
    where.location = { contains: location.trim(), mode: "insensitive" };
  }

  if (search?.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { company: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { snippet: { contains: term, mode: "insensitive" } },
      { skills: { has: term } },
    ];
  }

  const skip = (page - 1) * limit;

  return prisma.$transaction([
    prisma.job.findMany({
      where,
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);
};

export const createJobIfNotExists = async (data) => {
  const existing = await findJobByApplyUrl(data.applyUrl);
  if (existing) return { job: existing, created: false };

  const job = await prisma.job.create({ data });
  return { job, created: true };
};

export const toJobJSON = (job) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  source: job.source,
  applyUrl: job.applyUrl,
  description: job.description,
  snippet: job.snippet,
  skills: job.skills ?? [],
  postedAt: job.postedAt,
  postedText: job.postedText,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});
