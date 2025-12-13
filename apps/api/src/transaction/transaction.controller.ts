import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionRequest, CreateTransactionResponse, Transaction } from '@bosternexus/shared';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('start')
  async start(@Body() request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const transaction = this.transactionService.create(request.metadata);
    return {
      transaction: this.toDTO(transaction),
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Transaction> {
    const transaction = this.transactionService.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return this.toDTO(transaction);
  }

  private toDTO(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      state: entity.state,
      metadata: entity.metadata,
      lastUpdatedAt: entity.lastUpdatedAt,
    };
  }
}

