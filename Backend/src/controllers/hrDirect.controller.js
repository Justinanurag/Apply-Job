import {
  collectHrDirectSchema,
  listHrDirectSchema,
  sendHrEmailSchema,
} from "../validators/hrDirect.schema.js";
import {
  searchAndStoreHrDirectJobs,
  collectHrDirectJobsForUser,
  rematchAllJobsForUser,
} from "../services/hrDirect/hrDirectCollector.service.js";
import {
  listHrDirectJobsForUser,
  findHrDirectJobById,
  findHrDirectJobMatch,
  toHrDirectJobWithMatchJSON,
  upsertHrDirectJobMatch,
  updateHrDirectJobMatch,
} from "../models/hrDirectJob.model.js";
import { findProfileByUserId } from "../models/profile.model.js";
import { findUserById } from "../models/user.model.js";
import {
  matchHrJobToUser,
  generateTailoredResume,
  generateCoverLetter,
  generateRecruiterEmail,
} from "../services/hrDirect/hrDirectMatch.service.js";
import { sendHrApplicationEmail } from "../services/hrDirect/hrDirectEmail.service.js";

const getJobForUser = async (userId, jobId) => {
  const job = await findHrDirectJobById(jobId);
  if (!job) return null;

  let match = await findHrDirectJobMatch(userId, jobId);
  if (!match) {
    const profile = await findProfileByUserId(userId);
    const user = await findUserById(userId);
    const matchData = await matchHrJobToUser({ job, profile, user });
    match = await upsertHrDirectJobMatch(userId, jobId, matchData);
  }

  return toHrDirectJobWithMatchJSON(job, match);
};

export const collectHrDirectJobs = async (req, res) => {
  const parsed = collectHrDirectSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  try {
    const keyword = parsed.data.keyword ?? "Software Developer";
    const result = await searchAndStoreHrDirectJobs({
      keyword,
      location: parsed.data.location,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: `Collected ${result.stored} new HR direct apply posts`,
      data: result,
    });
  } catch (error) {
    console.error("collectHrDirectJobs error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const collectHrDirectFromProfile = async (req, res) => {
  try {
    const result = await collectHrDirectJobsForUser(req.user.id);
    return res.status(200).json({
      success: true,
      message: `Collected ${result.stored} HR posts from your profile`,
      data: result,
    });
  } catch (error) {
    console.error("collectHrDirectFromProfile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHrDirectJobs = async (req, res) => {
  const parsed = listHrDirectSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  const [jobs, total] = await listHrDirectJobsForUser({
    userId: req.user.id,
    ...parsed.data,
  });

  const { page, limit } = parsed.data;

  return res.status(200).json({
    success: true,
    message: "Success",
    data: {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const getHrDirectJobById = async (req, res) => {
  const job = await getJobForUser(req.user.id, req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  return res.status(200).json({ success: true, message: "Success", data: job });
};

export const refreshHrDirectMatch = async (req, res) => {
  const job = await findHrDirectJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  const profile = await findProfileByUserId(req.user.id);
  const user = await findUserById(req.user.id);
  const matchData = await matchHrJobToUser({ job, profile, user });
  const match = await upsertHrDirectJobMatch(req.user.id, job.id, matchData);

  return res.status(200).json({
    success: true,
    message: "Match score updated",
    data: toHrDirectJobWithMatchJSON(job, match),
  });
};

export const generateHrTailoredResume = async (req, res) => {
  try {
    const job = await findHrDirectJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const profile = await findProfileByUserId(req.user.id);
    const user = await findUserById(req.user.id);
    const tailoredResumeText = await generateTailoredResume({ job, profile, user });

    const existing = await findHrDirectJobMatch(req.user.id, job.id);
    const match = existing
      ? await updateHrDirectJobMatch(req.user.id, job.id, { tailoredResumeText })
      : await upsertHrDirectJobMatch(req.user.id, job.id, {
          matchScore: 0,
          missingSkills: [],
          matchReason: "",
          tailoredResumeText,
        });

    return res.status(200).json({
      success: true,
      message: "Tailored resume generated",
      data: { tailoredResumeText: match.tailoredResumeText },
    });
  } catch (error) {
    console.error("generateHrTailoredResume error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateHrCoverLetter = async (req, res) => {
  try {
    const job = await findHrDirectJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const profile = await findProfileByUserId(req.user.id);
    const user = await findUserById(req.user.id);
    const coverLetter = await generateCoverLetter({ job, profile, user });

    const existing = await findHrDirectJobMatch(req.user.id, job.id);
    const match = existing
      ? await updateHrDirectJobMatch(req.user.id, job.id, { coverLetter })
      : await upsertHrDirectJobMatch(req.user.id, job.id, {
          matchScore: 0,
          missingSkills: [],
          matchReason: "",
          coverLetter,
        });

    return res.status(200).json({
      success: true,
      message: "Cover letter generated",
      data: { coverLetter: match.coverLetter },
    });
  } catch (error) {
    console.error("generateHrCoverLetter error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendHrDirectEmail = async (req, res) => {
  const parsed = sendHrEmailSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  const job = await findHrDirectJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  const profile = await findProfileByUserId(req.user.id);
  const user = await findUserById(req.user.id);

  if (!profile?.resumeUrl) {
    return res.status(400).json({
      success: false,
      message: "Upload your resume in Settings before sending applications",
    });
  }

  let match = await findHrDirectJobMatch(req.user.id, job.id);
  let coverLetter = match?.coverLetter;

  if (!coverLetter) {
    coverLetter = await generateCoverLetter({ job, profile, user });
    match = match
      ? await updateHrDirectJobMatch(req.user.id, job.id, { coverLetter })
      : await upsertHrDirectJobMatch(req.user.id, job.id, {
          matchScore: 0,
          missingSkills: [],
          matchReason: "",
          coverLetter,
        });
  }

  const emailContent = await generateRecruiterEmail({ job, profile, user, coverLetter });
  const emailDraft = parsed.data.body ?? match?.recruiterEmailBody ?? emailContent.body;
  const subject = parsed.data.subject ?? emailContent.subject;

  await sendHrApplicationEmail({
    to: job.hrEmail,
    subject,
    body: emailDraft,
    replyTo: user.email,
    resumeUrl: profile.resumeUrl,
    resumeName: profile.resumeName ?? "resume.pdf",
  });

  match = match
    ? await updateHrDirectJobMatch(req.user.id, job.id, {
        recruiterEmailBody: emailDraft,
        emailSentAt: new Date(),
      })
    : await upsertHrDirectJobMatch(req.user.id, job.id, {
        matchScore: 0,
        missingSkills: [],
        matchReason: "",
        recruiterEmailBody: emailDraft,
        emailSentAt: new Date(),
      });

  return res.status(200).json({
    success: true,
    message: `Application email sent to ${job.hrEmail}`,
    data: {
      emailSentAt: match.emailSentAt,
      subject,
      body: emailDraft,
    },
  });
};

export const rematchHrDirectJobs = async (req, res) => {
  try {
    const result = await rematchAllJobsForUser(req.user.id);
    return res.status(200).json({
      success: true,
      message: `Updated match scores for ${result.matched} jobs`,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
