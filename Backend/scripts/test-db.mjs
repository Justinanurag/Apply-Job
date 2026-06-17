import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const urls = {
  pooled: process.env.DATABASE_URL,
  direct: process.env.DIRECT_URL,
};

for (const [label, url] of Object.entries(urls)) {
  if (!url) continue;
  const prisma = new PrismaClient({
    datasources: { db: { url } },
  });
  try {
    console.log(`Testing ${label}...`);
    await prisma.$connect();
    const count = await prisma.user.count();
    console.log(`${label}: OK (users: ${count})`);
  } catch (error) {
    console.error(`${label}: FAIL -`, error.message);
  } finally {
    await prisma.$disconnect();
  }
}
