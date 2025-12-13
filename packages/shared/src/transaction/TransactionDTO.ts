export enum TransactionState {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  STUCK = 'STUCK',
}

export interface Transaction {
  id: string;
  createdAt: Date;
  state: TransactionState;
  metadata: Record<string, unknown>;
  lastUpdatedAt: Date;
}

export interface CreateTransactionRequest {
  metadata?: Record<string, unknown>;
}

export interface CreateTransactionResponse {
  transaction: Transaction;
}

