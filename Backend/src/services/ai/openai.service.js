import axios from "axios";
import { env } from "../../config/env.js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseOpenAiError = (error) => {
  const status = error.response?.status;
  const apiMessage = error.response?.data?.error?.message;

  if (status === 429) {
    return new Error(
      apiMessage?.includes("quota")
        ? "OpenAI quota exceeded. Check billing at platform.openai.com or use template generation."
        : "OpenAI rate limit reached. Retrying failed — template content was used instead."
    );
  }

  if (status === 401) {
    return new Error("Invalid OPENAI_API_KEY. Update Backend/.env");
  }

  return new Error(apiMessage || error.message || "OpenAI request failed");
};

const isRetryable = (error) => {
  const status = error.response?.status;
  return status === 429 || status === 503 || status === 502;
};

const chat = async (systemPrompt, userPrompt, { json = true } = {}) => {
  if (!env.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await axios.post(
        OPENAI_URL,
        {
          model: env.openaiModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          ...(json ? { response_format: { type: "json_object" } } : {}),
        },
        {
          headers: {
            Authorization: `Bearer ${env.openaiApiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 60000,
          validateStatus: (status) => status < 500 || status === 503 || status === 502,
        }
      );

      if (response.status >= 400) {
        throw { response, message: `OpenAI HTTP ${response.status}` };
      }

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty AI response");

      if (json) {
        try {
          return JSON.parse(content);
        } catch {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
          throw new Error("AI returned invalid JSON");
        }
      }

      return content.trim();
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES && isRetryable(error)) {
        const delay = BASE_DELAY_MS * 2 ** attempt;
        console.warn(`OpenAI retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms (${error.response?.status})`);
        await sleep(delay);
        continue;
      }

      throw parseOpenAiError(error);
    }
  }

  throw parseOpenAiError(lastError);
};

const slimJob = (job) => ({
  title: job.title,
  company: job.company,
  location: job.location,
  experienceRequired: job.experienceRequired,
  skills: job.skills,
  hrName: job.hrName,
  description: job.description?.slice(0, 1500),
});

export const structureHrPostWithAI = async ({ title, snippet, link, searchKeyword }) => {
  const systemPrompt = `You extract structured hiring post data from recruiter/HR LinkedIn or job board posts.
Return JSON only with keys:
title, company, location, experienceRequired, skills (array), hrName, hrEmail, description, workMode (remote|onsite|hybrid|unknown).
If email is in text, extract it. Use null for unknown fields. skills should be tech skills only.`;

  const userPrompt = `Search keyword: ${searchKeyword ?? "N/A"}
URL: ${link}
Title: ${title}
Snippet: ${snippet}`;

  return chat(systemPrompt, userPrompt);
};

export const matchJobToProfileWithAI = async ({ job, profile, resumeText }) => {
  const systemPrompt = `You compare a candidate profile against an HR hiring post.
Return JSON only with keys:
matchScore (0-100 integer),
missingSkills (string array),
matchReason (2-3 sentences explaining fit).`;

  const userPrompt = `JOB:
${JSON.stringify(slimJob(job), null, 2)}

PROFILE:
${JSON.stringify(profile, null, 2)}

RESUME EXCERPT:
${(resumeText ?? "").slice(0, 2500)}`;

  return chat(systemPrompt, userPrompt);
};

export const generateTailoredResumeWithAI = async ({ job, profile, resumeText }) => {
  const systemPrompt = `You rewrite a resume tailored to a specific job posting.
Return JSON with key tailoredResumeText (plain text, sections with bullet points).`;

  const userPrompt = `JOB:
${JSON.stringify(slimJob(job), null, 2)}

PROFILE:
${JSON.stringify(profile, null, 2)}

CURRENT RESUME:
${(resumeText ?? "").slice(0, 3500)}`;

  return chat(systemPrompt, userPrompt);
};

export const generateCoverLetterWithAI = async ({ job, profile, resumeText }) => {
  const systemPrompt = `Write a professional cover letter for direct HR email application.
Return JSON with key coverLetter (plain text, 3-4 short paragraphs).`;

  const userPrompt = `JOB:
${JSON.stringify(slimJob(job), null, 2)}

CANDIDATE:
${JSON.stringify(profile, null, 2)}

RESUME:
${(resumeText ?? "").slice(0, 2500)}`;

  return chat(systemPrompt, userPrompt);
};

export const generateRecruiterEmailWithAI = async ({ job, profile, coverLetter }) => {
  const systemPrompt = `Write a concise professional email to an HR recruiter applying for a job.
Return JSON with keys subject and body (plain text body, under 180 words).`;

  const userPrompt = `JOB:
${JSON.stringify(slimJob(job), null, 2)}

CANDIDATE:
${JSON.stringify(profile, null, 2)}

COVER LETTER:
${(coverLetter ?? "").slice(0, 1500)}`;

  return chat(systemPrompt, userPrompt);
};

export const isAiEnabled = () => Boolean(env.openaiApiKey);
