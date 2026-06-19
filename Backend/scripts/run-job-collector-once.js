/**
 * Run the hourly job collector immediately (same logic as jobCron.js).
 * Usage: npm run jobs:collect
 */
import { prisma } from "../src/config/db.js";
import { collectJobsForUser } from "../src/services/jobs/jobCollector.service.js";
import { searchAndStoreJobs } from "../src/services/jobs/jobSearch.service.js";

const run = async () => {
  console.log("=== Job collector (manual run) ===\n");

  // Quick Serper smoke test
  const smoke = await searchAndStoreJobs({
    keyword: "React Developer",
    location: "India",
  });
  console.log("Smoke search:", {
    queriesRun: smoke.queriesRun,
    stored: smoke.stored,
    skipped: smoke.skipped,
    sample: smoke.jobs.slice(0, 3).map((j) => ({ title: j.title, source: j.source })),
  });

  const profiles = await prisma.userProfile.findMany({
    where: {
      OR: [
        { skills: { isEmpty: false } },
        { preferredRoles: { isEmpty: false } },
      ],
    },
    select: { userId: true, skills: true, preferredRoles: true },
    take: 20,
  });

  if (profiles.length === 0) {
    console.log("\nNo profiles with skills/roles — profile cron skipped.");
  } else {
    console.log(`\nCollecting for ${profiles.length} profile(s)...`);
    for (const profile of profiles) {
      try {
        const result = await collectJobsForUser(profile.userId);
        console.log(
          `User ${profile.userId}: stored ${result.stored}, skipped ${result.skipped}`
        );
      } catch (error) {
        console.warn(`User ${profile.userId} failed:`, error.message);
      }
    }
  }

  const total = await prisma.job.count();
  console.log(`\nTotal jobs in database: ${total}`);
};

run()
  .catch((err) => {
    console.error("Collector failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
