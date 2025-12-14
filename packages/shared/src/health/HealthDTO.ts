import { z } from 'zod';

export const HealthResponseSchema = z.object({
  ok: z.boolean(),
  version: z.string(),
  requestId: z.string().uuid(),
  timestamp: z.string().datetime(),
}).strict();

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

