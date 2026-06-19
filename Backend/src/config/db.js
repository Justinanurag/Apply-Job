import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.runtimeDatabaseUrl,
    },
  },
});

export const connectDB = async (maxAttempts = 8) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await prisma.$connect();
      console.log("PostgreSQL Neon DB connected successfully");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      console.warn(
        `PostgreSQL connection attempt ${attempt}/${maxAttempts} failed: ${error.message?.split("\n")[0]}`
      );

      if (isLastAttempt) {
        console.error(
          "Could not connect to Neon. The database may be waking from sleep — wait 10s and restart the server."
        );
        console.error(
          "Verify DATABASE_URL in Backend/.env and that your Neon project is active at console.neon.tech"
        );
        process.exit(1);
      }

      // Neon cold starts often need several seconds before compute accepts connections
      await sleep(Math.min(attempt * 3000, 15000));
    }
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
