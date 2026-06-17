import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { env } from "../config/env.js";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (user, candidatePassword) => {
  return bcrypt.compare(candidatePassword, user.password);
};

export const generateAccessToken = (user) => {
  return jwt.sign({ sub: user.id, role: user.role }, env.accessTokenSecret, {
    expiresIn: env.accessTokenExpiry,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ sub: user.id }, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiry,
  });
};

export const toPublicJSON = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const findUserById = (id) => prisma.user.findUnique({ where: { id } });

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

export const createUser = async ({ name, email, password, role = "user" }) => {
  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
    },
  });
};

export const updateUserById = async (id, data) => {
  const updateData = { ...data };

  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  if (updateData.email) {
    updateData.email = updateData.email.toLowerCase().trim();
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

export const clearUserRefreshToken = (id) =>
  prisma.user.update({
    where: { id },
    data: { refreshToken: null },
  });

export const findUserByResetToken = (hashedToken) =>
  prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { gt: new Date() },
    },
  });

export const findUserByEmailAndOtp = (email, hashedOtp) =>
  prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashedOtp,
      resetPasswordExpires: { gt: new Date() },
    },
  });