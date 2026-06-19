import { z } from "zod";

export const searchJobsSchema = z.object({
  keyword: z.string().trim().min(2, "Keyword must be at least 2 characters"),
  location: z.string().trim().optional(),
});

export const listJobsSchema = z.object({
  search: z.string().trim().optional(),
  source: z.string().trim().optional(),
  location: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});
