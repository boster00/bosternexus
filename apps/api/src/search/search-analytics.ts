import { Injectable } from '@nestjs/common';
import { Context } from '../context/Context';
import { logger } from '@bosternexus/foundation';

interface SearchAnalyticsEvent {
  query: string;
  tokens: string[];
  expandedTokens: string[];
  resultCount: number;
}

@Injectable()
export class SearchAnalytics {
  track(event: SearchAnalyticsEvent): void {
    const ctx = Context.current();
    logger.info('Search analytics event', {
      requestId: ctx?.requestId,
      sessionId: ctx?.sessionId,
      userId: ctx?.userId,
      event: {
        query: event.query,
        tokenCount: event.tokens.length,
        expandedTokenCount: event.expandedTokens.length,
        resultCount: event.resultCount,
      },
    });
  }
}

