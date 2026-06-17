import jwt from "jsonwebtoken";
import {
  clearUserRefreshToken,
  comparePassword,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByEmailAndOtp,
  generateAccessToken,
  generateRefreshToken,
  toPublicJSON,
  updateUserById,
} from "../models/user.model.js";
import { env } from "../config/env.js";
import { sendPasswordResetOtp } from "../services/mail.service.js";
import { generateOtp, hashOtp } from "../utils/otp.js";

const REFRESH_COOKIE = "refreshToken";

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
});

const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE, token, cookieOptions());
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  await createUser({ name, email, password });

  res.status(201).json({ success: true,
    message: "User registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !(await comparePassword(user, password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateUserById(user.id, { refreshToken });
  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: toPublicJSON(user), accessToken },
  });
};

export const logout = async (req, res) => {
  await clearUserRefreshToken(req.user.id);
  clearRefreshCookie(res);

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Success",
    data: { user: toPublicJSON(req.user) },
  });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ success: false, message: "Refresh token not found" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.refreshTokenSecret);
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }

  const user = await findUserById(decoded.sub);
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }

  const accessToken = generateAccessToken(user);

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    data: { accessToken },
  });
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await findUserById(req.user.id);

  if (!(await comparePassword(user, oldPassword))) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  await updateUserById(user.id, { password: newPassword });

  res.status(200).json({ success: true, message: "Password changed successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (user) {
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    await updateUserById(user.id, {
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    try {
      await sendPasswordResetOtp({ to: user.email, name: user.name, otp });
    } catch (error) {
      console.error("Failed to send OTP email:", error.message);
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }
  }

  res.status(200).json({
    success: true,
    message: "If that email exists, an OTP has been sent to your inbox",
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const hashedOtp = hashOtp(otp);
  const user = await findUserByEmailAndOtp(email, hashedOtp);

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  const resetToken = jwt.sign(
    { sub: user.id, purpose: "password_reset" },
    env.accessTokenSecret,
    { expiresIn: "15m" }
  );

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: { resetToken },
  });
};

export const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(resetToken, env.accessTokenSecret);
    if (decoded.purpose !== "password_reset") {
      throw new Error("Invalid token purpose");
    }
  } catch {
    return res.status(400).json({ success: false, message: "Invalid or expired reset session" });
  }

  const user = await findUserById(decoded.sub);
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  await updateUserById(user.id, {
    password,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    refreshToken: null,
  });

  res.status(200).json({ success: true, message: "Password reset successfully" });
};
