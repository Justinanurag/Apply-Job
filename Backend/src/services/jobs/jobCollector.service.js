import { findProfileByUserId } from "../../models/profile.model.js";
import { buildQueriesFromProfile } from "./jobQueries.service.js";
import { searchGoogle } from "./serper.service.js";
import { filterJobResults } from "./jobUrlFilter.service.js";
import { extractJobFromSearchResult } from "./jobExtract.service.js";
import { createJobIfNotExists, toJobJSON } from "../../models/job.model.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const collectJobsForUser = async (userId) => {
  const profile = await findProfileByUserId(userId);
  const queries = buildQueriesFromProfile(profile);

  const storedJobs = [];
  const seenUrls = new Set();
  let skipped = 0;

  for (const { source, query, keyword } of queries) {
    let organic = [];
    try {
      organic = await searchGoogle(query, { num: 8, gl: "in" });
    } catch (error) {
      console.warn(`Collector search failed (${source}):`, error.message);
      continue;
    }

    const location = profile?.preferredLocations?.[0] ?? profile?.location ?? "India";
    const filtered = filterJobResults(organic);

    for (const item of filtered) {
      if (seenUrls.has(item.link)) continue;
      seenUrls.add(item.link);

      const extracted = extractJobFromSearchResult(item, { keyword, location, source });
      const { job, created } = await createJobIfNotExists(extracted);

      if (created) storedJobs.push(toJobJSON(job));
      else skipped += 1;
    }

    await delay(500);
  }

  return { stored: storedJobs.length, skipped, jobs: storedJobs };
};
