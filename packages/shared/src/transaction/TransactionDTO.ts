import { z } from 'zod';

export enum TransactionState {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  STUCK = 'STUCK',
}

export const TransactionPurposeSchema = z.enum([
  'checkout',
  'sync',
  'webhook',
  'other',
]);

export type TransactionPurpose = z.infer<typeof TransactionPurposeSchema>;

export const CreateTransactionRequestSchema = z.object({
  purpose: TransactionPurposeSchema,
  metadata: z.record(z.unknown()).optional().default({}),
}).strict();

export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequestSchema>;

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  state: z.nativeEnum(TransactionState),
  metadata: z.record(z.unknown()),
  lastUpdatedAt: z.string().datetime(),
}).strict();

export type Transaction = z.infer<typeof TransactionSchema>;

export const CreateTransactionResponseSchema = z.object({
  transaction: TransactionSchema,
}).strict();

export type CreateTransactionResponse = z.infer<typeof CreateTransactionResponseSchema>;

