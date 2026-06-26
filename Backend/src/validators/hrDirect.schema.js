import { z } from "zod";

export const collectHrDirectSchema = z.object({
  keyword: z.string().trim().min(2, "Keyword must be at least 2 characters").optional(),
  location: z.string().trim().optional(),
});

export const listHrDirectSchema = z.object({
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  source: z.string().trim().optional(),
  minMatchScore: z.coerce.number().int().min(0).max(100).optional(),
  workMode: z.enum(["all", "remote", "onsite", "hybrid"]).optional().default("all"),
  experience: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export const sendHrEmailSchema = z.object({
  subject: z.string().trim().min(3).optional(),
  body: z.string().trim().min(10).optional(),
});
