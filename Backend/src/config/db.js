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

export const connectDB = async (maxAttempts = 5) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await prisma.$connect();
      console.log("PostgreSQL Neon DB connected successfully");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      console.warn(
        `PostgreSQL connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`
      );

      if (isLastAttempt) {
        console.error(
          "Could not connect to Neon. Check DATABASE_URL / DIRECT_URL in .env"
        );
        process.exit(1);
      }

      await sleep(attempt * 2000);
    }
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};