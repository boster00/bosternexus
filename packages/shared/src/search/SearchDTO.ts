import { z } from 'zod';

// Strict validation schemas
export const SearchRequestSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
}).strict(); // Deny unknown keys

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const SearchResultItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
}).strict();

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;

export const SearchResponseSchema = z.object({
  query: z.string(),
  results: z.array(SearchResultItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
}).strict();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

