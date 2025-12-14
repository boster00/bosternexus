import { Injectable } from '@nestjs/common';
import { TransactionEntity } from './transaction.entity';
import { TransactionState } from '@bosternexus/shared';
import { randomUUID } from 'crypto';

@Injectable()
export class TransactionService {
  private transactions: Map<string, TransactionEntity> = new Map();

  create(metadata: Record<string, unknown> = {}): TransactionEntity {
    const id = randomUUID();
    const transaction = new TransactionEntity(id, TransactionState.INITIATED, metadata);
    this.transactions.set(id, transaction);
    return transaction;
  }

  findById(id: string): TransactionEntity | undefined {
    return this.transactions.get(id);
  }

  findAll(): TransactionEntity[] {
    return Array.from(this.transactions.values());
  }

  updateState(id: string, newState: TransactionState): void {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.updateState(newState);
    }
  }

  findStuckTransactions(thresholdMinutes: number): TransactionEntity[] {
    const now = new Date();
    const threshold = new Date(now.getTime() - thresholdMinutes * 60 * 1000);

    return this.findAll().filter(tx => {
      return (
        tx.state === TransactionState.INITIATED &&
        tx.createdAt < threshold
      );
    });
  }
}

