import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionService } from './transaction.service';
import { TransactionState } from '@bosternexus/shared';
import { logger as foundationLogger } from '@bosternexus/foundation';

@Injectable()
export class TransactionWatchdog {
  private readonly logger = new Logger(TransactionWatchdog.name);
  private readonly STUCK_THRESHOLD_MINUTES = 5;

  constructor(private readonly transactionService: TransactionService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkStuckTransactions() {
    const stuck = this.transactionService.findStuckTransactions(
      this.STUCK_THRESHOLD_MINUTES
    );

    if (stuck.length > 0) {
      for (const tx of stuck) {
        this.transactionService.updateState(tx.id, TransactionState.STUCK);
        foundationLogger.warn('ALERT: stuck transaction detected', {
          transactionId: tx.id,
          createdAt: tx.createdAt.toISOString(),
          state: tx.state,
        });
        this.logger.warn(`ALERT: stuck transaction ${tx.id}`);
      }
    }
  }
}

