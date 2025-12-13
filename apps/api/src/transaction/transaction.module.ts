import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionWatchdog } from './transaction.watchdog';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionWatchdog],
})
export class TransactionModule {}

