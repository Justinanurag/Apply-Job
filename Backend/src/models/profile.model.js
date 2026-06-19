import { prisma } from "../config/db.js";

export const findProfileByUserId = (userId) =>
  prisma.userProfile.findUnique({ where: { userId } });

export const createProfile = (userId, data) =>
  prisma.userProfile.create({
    data: { userId, ...data },
  });

export const updateProfile = (userId, data) =>
  prisma.userProfile.update({
    where: { userId },
    data,
  });

export const upsertProfile = (userId, data) =>
  prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

export const toProfileJSON = (profile, completionPercent) => ({
  id: profile.id,
  userId: profile.userId,
  fullName: profile.fullName,
  phone: profile.phone,
  location: profile.location,
  currentRole: profile.currentRole,
  experience: profile.experience,
  linkedInUrl: profile.linkedInUrl,
  githubUrl: profile.githubUrl,
  portfolioUrl: profile.portfolioUrl,
  currentCompany: profile.currentCompany,
  currentCTC: profile.currentCTC,
  expectedCTC: profile.expectedCTC,
  noticePeriod: profile.noticePeriod,
  employmentType: profile.employmentType,
  skills: profile.skills,
  techStacks: profile.techStacks,
  preferredRoles: profile.preferredRoles,
  preferredLocations: profile.preferredLocations,
  salaryExpectation: profile.salaryExpectation,
  remotePreference: profile.remotePreference,
  openToRelocation: profile.openToRelocation,
  resumeUrl: profile.resumeUrl,
  resumeName: profile.resumeName,
  resumeUploadedAt: profile.resumeUploadedAt,
  isComplete: profile.isComplete,
  completionPercent,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});
