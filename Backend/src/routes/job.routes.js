import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  searchJobs,
  getJobs,
  getJobById,
  collectFromProfile,
} from "../controllers/job.controller.js";

const router = Router();

router.use(authenticate);

router.post("/search", asyncHandler(searchJobs));
router.post("/collect-profile", asyncHandler(collectFromProfile));
router.get("/", asyncHandler(getJobs));
router.get("/:id", asyncHandler(getJobById));

export default router;
