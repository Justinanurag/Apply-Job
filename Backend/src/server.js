import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { startJobCollectorCron } from "./jobs/jobCron.js";
import { startHrDirectJobCron } from "./jobs/hrDirectCron.js";

const startServer = async () => {
  try {
    await connectDB();
    startJobCollectorCron();
    startHrDirectJobCron();
    app.listen(env.port, () => {
      console.log(`🚀 Server running on ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();