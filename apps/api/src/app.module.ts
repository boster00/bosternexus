import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { TransactionModule } from './transaction/transaction.module';
import { ContextMiddleware } from './context/context.middleware';

@Module({
  imports: [SearchModule, TransactionModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}

