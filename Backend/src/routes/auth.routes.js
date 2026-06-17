import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validators/auth.schema.js";
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", authenticate, asyncHandler(logout));
router.get("/me", authenticate, asyncHandler(getMe));
router.post("/refresh-token", asyncHandler(refreshToken));
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(changePassword)
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);
router.post("/verify-otp", validate(verifyOtpSchema), asyncHandler(verifyOtp));
router.post("/reset-password", validate(resetPasswordSchema), asyncHandler(resetPassword));

export default router;
