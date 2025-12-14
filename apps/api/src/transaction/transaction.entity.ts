import { TransactionState } from '@bosternexus/shared';

export class TransactionEntity {
  id: string;
  createdAt: Date;
  state: TransactionState;
  metadata: Record<string, unknown>;
  lastUpdatedAt: Date;

  constructor(
    id: string,
    state: TransactionState,
    metadata: Record<string, unknown> = {}
  ) {
    this.id = id;
    this.state = state;
    this.metadata = metadata;
    this.createdAt = new Date();
    this.lastUpdatedAt = new Date();
  }

  updateState(newState: TransactionState): void {
    this.state = newState;
    this.lastUpdatedAt = new Date();
  }
}

