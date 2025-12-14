import { Controller, Post, Body, Get, Param, Headers, BadRequestException, Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './transaction.entity';
import {
  CreateTransactionRequest,
  CreateTransactionRequestSchema,
  CreateTransactionResponse,
  Transaction,
} from '@bosternexus/shared';
import { IdempotencyStore } from '@bosternexus/foundation';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('IdempotencyStore') private readonly idempotencyStore: IdempotencyStore
  ) {}

  @Post('start')
  async start(
    @Body() body: unknown,
    @Headers('idempotency-key') idempotencyKey?: string
  ): Promise<CreateTransactionResponse> {
    // Require idempotency key
    if (!idempotencyKey) {
      throw new BadRequestException({
        message: 'Idempotency-Key header is required',
      });
    }

    // Strict validation
    const validationResult = CreateTransactionRequestSchema.safeParse(body);
    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Invalid transaction request',
        errors: validationResult.error.errors,
      });
    }

    // Check idempotency
    const existing = await this.idempotencyStore.get(idempotencyKey);
    if (existing) {
      return existing.result as CreateTransactionResponse;
    }

    const request: CreateTransactionRequest = validationResult.data;
    const transaction = this.transactionService.create(request.metadata);

    const response: CreateTransactionResponse = {
      transaction: this.toDTO(transaction),
    };

    // Store idempotency result
    await this.idempotencyStore.set(idempotencyKey, response, 3600);

    return response;
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Transaction> {
    const transaction = this.transactionService.findById(id);
    if (!transaction) {
      throw new BadRequestException({
        message: 'Transaction not found',
      });
    }
    return this.toDTO(transaction);
  }

  private toDTO(entity: TransactionEntity): Transaction {
    return {
      id: entity.id,
      createdAt: entity.createdAt.toISOString(),
      state: entity.state,
      metadata: entity.metadata,
      lastUpdatedAt: entity.lastUpdatedAt.toISOString(),
    };
  }
}

