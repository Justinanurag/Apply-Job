import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const stripQuotes = (value) => value?.replace(/^['"]|['"]$/g, "") ?? "";

const appendConnectionParams = (url) => {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "30");
    }
    if (!parsed.searchParams.has("pool_timeout")) {
      parsed.searchParams.set("pool_timeout", "30");
    }
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

const buildUploadthingToken = () => {
  const explicitToken = stripQuotes(process.env.UPLOADTHING_TOKEN);
  if (explicitToken) return explicitToken;

  const secret = stripQuotes(process.env.UPLOADTHING_SECRET);
  const appId = stripQuotes(process.env.UPLOADTHING_APP_ID);
  if (!secret || !appId) return "";

  // Already a v7 token from dashboard
  if (secret.startsWith("eyJ")) return secret;

  const region = stripQuotes(process.env.UPLOADTHING_REGION) || "sea1";
  return Buffer.from(
    JSON.stringify({ apiKey: secret, appId, regions: [region] })
  ).toString("base64");
};

const rawDatabaseUrl = stripQuotes(process.env.DATABASE_URL);
const rawDirectUrl =
  stripQuotes(process.env.DIRECT_URL) || rawDatabaseUrl.replace("-pooler.", ".");

const databaseUrl = appendConnectionParams(rawDatabaseUrl);
const directUrl = appendConnectionParams(rawDirectUrl);

const runtimeDatabaseUrl = appendConnectionParams(
  stripQuotes(process.env.RUNTIME_DATABASE_URL) || databaseUrl || directUrl
);

const port = Number(process.env.PORT) || 5000;

export const env = {
  port,
  databaseUrl,
  directUrl,
  runtimeDatabaseUrl,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "dev-access-secret-change-me",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret-change-me",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:8080",
  isProduction: process.env.NODE_ENV === "production",
  senderEmail: process.env.SENDER_EMAIL || "",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpHost: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  uploadthingToken: buildUploadthingToken(),
  uploadthingAppId: stripQuotes(process.env.UPLOADTHING_APP_ID) || "",
  apiBaseUrl: stripQuotes(process.env.API_BASE_URL) || `http://localhost:${port}`,
  serperApiKey: stripQuotes(process.env.SERPER_API_KEY) || "",
  jobCronEnabled: process.env.JOB_CRON_ENABLED === "true",
};
