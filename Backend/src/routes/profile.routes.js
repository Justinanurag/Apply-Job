import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getProfile,
  createProfile,
  updateProfileHandler,
  patchProfile,
  uploadResume,
  deleteResume,
} from "../controllers/profile.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(getProfile));
router.post("/", asyncHandler(createProfile));
router.put("/", asyncHandler(updateProfileHandler));
router.patch("/", asyncHandler(patchProfile));
router.post("/upload-resume", asyncHandler(uploadResume));
router.delete("/resume", asyncHandler(deleteResume));

export default router;
