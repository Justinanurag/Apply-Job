import cron from "node-cron";
import { prisma } from "../config/db.js";
import { collectJobsForUser } from "../services/jobs/jobCollector.service.js";
import { env } from "../config/env.js";

export const startJobCollectorCron = () => {
  if (!env.jobCronEnabled || !env.serperApiKey) {
    console.log("Job collector cron disabled (set JOB_CRON_ENABLED=true and SERPER_API_KEY)");
    return;
  }
//Cron Job
  cron.schedule("0 * * * *", async () => {
    console.log("[cron] Starting hourly job collection...");

    try {
      const profiles = await prisma.userProfile.findMany({
        where: {
          OR: [
            { skills: { isEmpty: false } },
            { preferredRoles: { isEmpty: false } },
          ],
        },
        select: { userId: true },
        take: 20,
      });

      for (const { userId } of profiles) {
        try {
          const result = await collectJobsForUser(userId);
          console.log(`[cron] User ${userId}: stored ${result.stored} jobs`);
        } catch (error) {
          console.warn(`[cron] User ${userId} failed:`, error.message);
        }
      }
    } catch (error) {
      console.error("[cron] Job collection failed:", error.message);
    }
  });

  console.log("Job collector cron scheduled (every hour)");
};
