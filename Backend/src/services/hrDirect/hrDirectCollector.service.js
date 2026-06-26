import { searchGoogle } from "../jobs/serper.service.js";
import { buildHrDirectQueries, buildHrQueriesFromProfile } from "./hrDirectQueries.service.js";
import { filterHrDirectResults } from "./hrDirectFilter.service.js";
import { extractHrDirectJob } from "./hrDirectExtract.service.js";
import {
  createHrDirectJobIfNotExists,
  upsertHrDirectJobMatch,
  toHrDirectJobJSON,
} from "../../models/hrDirectJob.model.js";
import { findProfileByUserId } from "../../models/profile.model.js";
import { findUserById } from "../../models/user.model.js";
import { matchHrJobToUser } from "./hrDirectMatch.service.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const storeAndMatch = async (item, context, userId) => {
  const extracted = await extractHrDirectJob(item, context);
  const { job, created } = await createHrDirectJobIfNotExists(extracted);

  if (userId) {
    const profile = await findProfileByUserId(userId);
    const user = await findUserById(userId);
    const match = await matchHrJobToUser({ job, profile, user });
    await upsertHrDirectJobMatch(userId, job.id, match);
  }

  return { job: toHrDirectJobJSON(job), created };
};

export const searchAndStoreHrDirectJobs = async ({ keyword, location, userId }) => {
  const queries = buildHrDirectQueries(keyword, location);
  const storedJobs = [];
  const seenUrls = new Set();
  let queriesRun = 0;
  let skipped = 0;

  for (const { source, query, roleKeyword } of queries.slice(0, 12)) {
    queriesRun += 1;

    let organic = [];
    try {
      organic = await searchGoogle(query, { num: 10, gl: "in" });
    } catch (error) {
      console.warn(`HR direct search failed:`, error.message);
      continue;
    }

    const filtered = filterHrDirectResults(organic);

    for (const item of filtered) {
      if (seenUrls.has(item.link)) {
        skipped += 1;
        continue;
      }
      seenUrls.add(item.link);

      try {
        const { job, created } = await storeAndMatch(
          item,
          { roleKeyword: roleKeyword ?? keyword, location, source },
          userId
        );
        if (created) storedJobs.push(job);
        else skipped += 1;
      } catch (error) {
        console.warn("HR job store failed:", error.message);
        skipped += 1;
      }
    }

    await delay(500);
  }

  return { keyword, location: location ?? null, queriesRun, stored: storedJobs.length, skipped, jobs: storedJobs };
};

export const collectHrDirectJobsForUser = async (userId) => {
  const profile = await findProfileByUserId(userId);
  const queries = buildHrQueriesFromProfile(profile);
  const storedJobs = [];
  const seenUrls = new Set();
  let skipped = 0;

  for (const { source, query, roleKeyword } of queries.slice(0, 15)) {
    let organic = [];
    try {
      organic = await searchGoogle(query, { num: 8, gl: "in" });
    } catch (error) {
      console.warn(`HR collector search failed:`, error.message);
      continue;
    }

    const location = profile?.preferredLocations?.[0] ?? profile?.location ?? "India";
    const filtered = filterHrDirectResults(organic);

    for (const item of filtered) {
      if (seenUrls.has(item.link)) continue;
      seenUrls.add(item.link);

      try {
        const { job, created } = await storeAndMatch(
          item,
          { roleKeyword, location, source },
          userId
        );
        if (created) storedJobs.push(job);
        else skipped += 1;
      } catch (error) {
        skipped += 1;
      }
    }

    await delay(500);
  }

  return { stored: storedJobs.length, skipped, jobs: storedJobs };
};

export const rematchAllJobsForUser = async (userId) => {
  const { prisma } = await import("../../config/db.js");
  const profile = await findProfileByUserId(userId);
  const user = await findUserById(userId);
  const jobs = await prisma.hrDirectJob.findMany({ take: 100, orderBy: { createdAt: "desc" } });

  let matched = 0;
  for (const job of jobs) {
    const match = await matchHrJobToUser({ job, profile, user });
    await upsertHrDirectJobMatch(userId, job.id, match);
    matched += 1;
  }

  return { matched };
};
