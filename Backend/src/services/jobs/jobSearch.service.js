import { searchGoogle } from "./serper.service.js";
import { buildSearchQueries } from "./jobQueries.service.js";
import { filterJobResults } from "./jobUrlFilter.service.js";
import { extractJobFromSearchResult } from "./jobExtract.service.js";
import { createJobIfNotExists, toJobJSON } from "../../models/job.model.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const searchAndStoreJobs = async ({ keyword, location }) => {
  const queries = buildSearchQueries(keyword, location);
  const storedJobs = [];
  const seenUrls = new Set();
  let searched = 0;
  let skipped = 0;

  for (const { source, query } of queries) {
    searched += 1;

    let organic = [];
    try {
      organic = await searchGoogle(query, { num: 10, gl: "in" });
    } catch (error) {
      console.warn(`Serper search failed for ${source}:`, error.message);
      continue;
    }

    const filtered = filterJobResults(organic);

    for (const item of filtered) {
      if (seenUrls.has(item.link)) {
        skipped += 1;
        continue;
      }
      seenUrls.add(item.link);

      const extracted = extractJobFromSearchResult(item, { keyword, location, source });
      const { job, created } = await createJobIfNotExists(extracted);

      if (created) {
        storedJobs.push(toJobJSON(job));
      } else {
        skipped += 1;
      }
    }

    // Light rate-limit between platform queries
    await delay(400);
  }

  return {
    keyword,
    location: location ?? null,
    queriesRun: searched,
    stored: storedJobs.length,
    skipped,
    jobs: storedJobs,
  };
};
