import cron from "node-cron";
import { prisma } from "../config/db.js";
import { collectHrDirectJobsForUser } from "../services/hrDirect/hrDirectCollector.service.js";
import { searchAndStoreHrDirectJobs } from "../services/hrDirect/hrDirectCollector.service.js";
import { env } from "../config/env.js";

export const startHrDirectJobCron = () => {
  if (!env.hrDirectCronEnabled || !env.serperApiKey) {
    console.log(
      "HR Direct Apply cron disabled (set HR_DIRECT_CRON_ENABLED=true and SERPER_API_KEY)"
    );
    return;
  }

  cron.schedule("30 * * * *", async () => {
    console.log("[cron] Starting HR Direct Apply job collection...");

    try {
      await searchAndStoreHrDirectJobs({
        keyword: "Software Developer",
        location: "India",
        userId: null,
      });

      const profiles = await prisma.userProfile.findMany({
        where: {
          OR: [
            { skills: { isEmpty: false } },
            { preferredRoles: { isEmpty: false } },
          ],
        },
        select: { userId: true },
        take: 10,
      });

      for (const { userId } of profiles) {
        try {
          const result = await collectHrDirectJobsForUser(userId);
          console.log(`[cron] HR Direct user ${userId}: stored ${result.stored} posts`);
        } catch (error) {
          console.warn(`[cron] HR Direct user ${userId} failed:`, error.message);
        }
      }
    } catch (error) {
      console.error("[cron] HR Direct collection failed:", error.message);
    }
  });

  console.log("HR Direct Apply cron scheduled (every hour at :30)");
};
