import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionWatchdog } from './transaction.watchdog';
import { InMemoryIdempotencyStore, IdempotencyStore } from '@bosternexus/foundation';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionWatchdog,
    {
      provide: 'IdempotencyStore',
      useClass: InMemoryIdempotencyStore,
    },
  ],
  exports: [TransactionService],
})
export class TransactionModule {}

