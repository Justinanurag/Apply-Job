import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  collectHrDirectJobs,
  collectHrDirectFromProfile,
  getHrDirectJobs,
  getHrDirectJobById,
  refreshHrDirectMatch,
  generateHrTailoredResume,
  generateHrCoverLetter,
  sendHrDirectEmail,
  rematchHrDirectJobs,
} from "../controllers/hrDirect.controller.js";

const router = Router();

router.use(authenticate);

router.post("/collect", asyncHandler(collectHrDirectJobs));
router.post("/collect-profile", asyncHandler(collectHrDirectFromProfile));
router.post("/rematch", asyncHandler(rematchHrDirectJobs));
router.get("/", asyncHandler(getHrDirectJobs));
router.get("/:id", asyncHandler(getHrDirectJobById));
router.post("/:id/match", asyncHandler(refreshHrDirectMatch));
router.post("/:id/generate-resume", asyncHandler(generateHrTailoredResume));
router.post("/:id/generate-cover-letter", asyncHandler(generateHrCoverLetter));
router.post("/:id/send-email", asyncHandler(sendHrDirectEmail));

export default router;
