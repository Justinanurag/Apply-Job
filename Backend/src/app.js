import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import jobRoutes from "./routes/job.routes.js";
import hrDirectRoutes from "./routes/hrDirect.routes.js";

import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing/router.js";
import { env } from "./config/env.js";

const app = express();

const devOrigins = [
  env.clientUrl,
  "http://localhost:8080",
];

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.isProduction
      ? env.clientUrl
      : (origin, callback) => {
          if (!origin || devOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
    credentials: true,
  })
);

app.use(morgan(env.isProduction ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Server Running 🚀",
  });
});

// UploadThing must stay public — auth runs inside the file router middleware
app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: env.uploadthingToken,
      callbackUrl: `${env.apiBaseUrl}/api/uploadthing`,
      isDev: !env.isProduction,
      logLevel: env.isProduction ? "Info" : "Debug",
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/hr-direct-jobs", hrDirectRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
