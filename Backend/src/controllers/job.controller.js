import { searchJobsSchema, listJobsSchema } from "../validators/job.schema.js";
import { searchAndStoreJobs } from "../services/jobs/jobSearch.service.js";
import { collectJobsForUser } from "../services/jobs/jobCollector.service.js";
import { findJobById, listJobs, toJobJSON } from "../models/job.model.js";

export const searchJobs = async (req, res) => {
  const parsed = searchJobsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  try {
    const result = await searchAndStoreJobs(parsed.data);
    return res.status(200).json({
      success: true,
      message: `Found and stored ${result.stored} new jobs`,
      data: result,
    });
  } catch (error) {
    console.error("searchJobs error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Job search failed",
    });
  }
};

export const getJobs = async (req, res) => {
  const parsed = listJobsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message || "Validation failed",
    });
  }

  const [jobs, total] = await listJobs(parsed.data);
  const { page, limit } = parsed.data;

  return res.status(200).json({
    success: true,
    message: "Success",
    data: {
      jobs: jobs.map(toJobJSON),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};

export const getJobById = async (req, res) => {
  const job = await findJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Success",
    data: toJobJSON(job),
  });
};

export const collectFromProfile = async (req, res) => {
  try {
    const result = await collectJobsForUser(req.user.id);
    return res.status(200).json({
      success: true,
      message: `Collected ${result.stored} new jobs from your profile`,
      data: result,
    });
  } catch (error) {
    console.error("collectFromProfile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Job collection failed",
    });
  }
};
