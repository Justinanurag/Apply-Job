import {
  findProfileByUserId,
  upsertProfile,
  updateProfile,
  toProfileJSON,
} from "../models/profile.model.js";
import {
  saveProfileSchema,
  profilePatchSchema,
  calculateCompletion,
  checkProfileComplete,
  checkMinimumProfile,
} from "../validators/profile.schema.js";
import { parseResumeFile, mergeParsedIntoProfile, guessMimeFromName } from "../services/resumeParser.service.js";
import { deleteUploadThingFile } from "../services/uploadthing.service.js";
import { sanitizeMergedProfile } from "../utils/profileSanitize.js";
const buildProfileResponse = async (userId, email) => {
  const profile = await findProfileByUserId(userId);

  if (!profile) {
    return {
      profile: null,
      email,
      completionPercent: 0,
      isComplete: false,
      canAccessDashboard: false,
    };
  }

  const completionPercent = calculateCompletion(profile);
  const isComplete = checkProfileComplete(profile);
  const canAccessDashboard = checkMinimumProfile(profile);

  if (profile.isComplete !== isComplete) {
    await updateProfile(userId, { isComplete });
    profile.isComplete = isComplete;
  }

  return {
    profile: toProfileJSON(profile, completionPercent),
    email,
    completionPercent,
    isComplete,
    canAccessDashboard,
  };
};

const sanitizeProfileData = (data) => {
  const sanitized = {};

  if (data.fullName !== undefined) sanitized.fullName = data.fullName;
  if (data.phone !== undefined) sanitized.phone = data.phone;
  if (data.location !== undefined) sanitized.location = data.location;
  if (data.currentRole !== undefined) sanitized.currentRole = data.currentRole;
  if (data.experience !== undefined) sanitized.experience = data.experience;
  if (data.linkedInUrl !== undefined) sanitized.linkedInUrl = data.linkedInUrl || null;
  if (data.githubUrl !== undefined) sanitized.githubUrl = data.githubUrl || null;
  if (data.portfolioUrl !== undefined) sanitized.portfolioUrl = data.portfolioUrl || null;
  if (data.currentCompany !== undefined) sanitized.currentCompany = data.currentCompany || null;
  if (data.currentCTC !== undefined) sanitized.currentCTC = data.currentCTC ?? null;
  if (data.expectedCTC !== undefined) sanitized.expectedCTC = data.expectedCTC ?? null;
  if (data.noticePeriod !== undefined) sanitized.noticePeriod = data.noticePeriod ?? null;
  if (data.employmentType !== undefined) sanitized.employmentType = data.employmentType || null;
  if (data.skills !== undefined) sanitized.skills = data.skills;
  if (data.techStacks !== undefined) sanitized.techStacks = data.techStacks;
  if (data.preferredRoles !== undefined) sanitized.preferredRoles = data.preferredRoles;
  if (data.preferredLocations !== undefined) sanitized.preferredLocations = data.preferredLocations;
  if (data.salaryExpectation !== undefined) sanitized.salaryExpectation = data.salaryExpectation ?? null;
  if (data.remotePreference !== undefined) sanitized.remotePreference = data.remotePreference ?? null;
  if (data.openToRelocation !== undefined) sanitized.openToRelocation = data.openToRelocation;

  return sanitized;
};

const finalizeProfile = async (userId, email, profile) => {
  const isComplete = checkProfileComplete(profile);
  if (profile.isComplete !== isComplete) {
    await updateProfile(userId, { isComplete });
    profile.isComplete = isComplete;
  }
  const completionPercent = calculateCompletion(profile);
  const canAccessDashboard = checkMinimumProfile(profile);

  return {
    profile: toProfileJSON(profile, completionPercent),
    email,
    completionPercent,
    isComplete: profile.isComplete,
    canAccessDashboard,
  };
};

export const getProfile = async (req, res) => {
  const result = await buildProfileResponse(req.user.id, req.user.email);
  res.status(200).json({ success: true, message: "Success", data: result });
};

export const saveProfile = async (req, res) => {
  const parsed = saveProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  const existing = await findProfileByUserId(req.user.id);
  const profileData = sanitizeProfileData(parsed.data);

  const profile = await upsertProfile(req.user.id, {
    ...profileData,
    resumeUrl: existing?.resumeUrl ?? null,
    resumeName: existing?.resumeName ?? null,
    resumeKey: existing?.resumeKey ?? null,
    resumeUploadedAt: existing?.resumeUploadedAt ?? null,
  });

  const data = await finalizeProfile(req.user.id, req.user.email, profile);

  res.status(existing ? 200 : 201).json({
    success: true,
    message: existing ? "Profile updated successfully" : "Profile created successfully",
    data,
  });
};

export const patchProfile = async (req, res) => {
  const parsed = profilePatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  const existing = await findProfileByUserId(req.user.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Profile not found. Save personal info first." });
  }

  const profileData = sanitizeProfileData(parsed.data);
  const profile = await updateProfile(req.user.id, profileData);
  const data = await finalizeProfile(req.user.id, req.user.email, profile);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data,
  });
};

export const createProfile = saveProfile;
export const updateProfileHandler = saveProfile;

export const uploadResume = async (req, res) => {
  try {
    const { resumeUrl, resumeName, resumeKey } = req.body;

    if (!resumeUrl || !resumeName) {
      return res.status(400).json({ success: false, message: "No resume URL or name provided" });
    }

    let existing = await findProfileByUserId(req.user.id);
    if (!existing) {
      existing = await upsertProfile(req.user.id, {
        fullName: req.user.name,
        skills: [],
        techStacks: [],
        preferredRoles: [],
        preferredLocations: [],
      });
    }

    if (existing.resumeKey && resumeKey && existing.resumeKey !== resumeKey) {
      await deleteUploadThingFile(existing.resumeKey);
    }

    // Step 1 — always persist resume file info first
    let profile = await updateProfile(req.user.id, {
      resumeUrl,
      resumeName,
      resumeKey: resumeKey ?? null,
      resumeUploadedAt: new Date(),
    });

    // Step 2 — parse and merge profile fields (non-blocking for save)
    let parsedFromResume = {};
    try {
      const mimetype = guessMimeFromName(resumeName);
      parsedFromResume = await parseResumeFile(resumeUrl, mimetype);
      const merged = sanitizeMergedProfile(mergeParsedIntoProfile(profile, parsedFromResume));
      profile = await updateProfile(req.user.id, merged);
    } catch (parseError) {
      console.warn("Resume parse warning:", parseError.message);
    }

    const finalized = await finalizeProfile(req.user.id, req.user.email, profile);

    return res.status(200).json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      data: {
        ...finalized,
        parsedFromResume,
      },
    });
  } catch (error) {
    console.error("uploadResume failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  const existing = await findProfileByUserId(req.user.id);
  if (!existing?.resumeUrl) {
    return res.status(404).json({ success: false, message: "No resume to delete" });
  }

  if (existing.resumeKey) {
    await deleteUploadThingFile(existing.resumeKey);
  }

  const profile = await updateProfile(req.user.id, {
    resumeUrl: null,
    resumeName: null,
    resumeKey: null,
    resumeUploadedAt: null,
    isComplete: false,
  });

  const data = await finalizeProfile(req.user.id, req.user.email, profile);

  res.status(200).json({
    success: true,
    message: "Resume removed successfully",
    data,
  });
};

