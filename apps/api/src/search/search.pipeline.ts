import { Injectable, Inject } from '@nestjs/common';
import { QueryParser } from './query-parser';
import { SynonymService } from './synonym.service';
import { SearchEngineAdapter } from './search-engine.adapter';
import { SearchResultMapper } from './search-result.mapper';
import { SearchAnalytics } from './search-analytics';
import { SearchRequest, SearchResponse } from '@bosternexus/shared';
import { Context } from '../context/Context';
import { logger } from '@bosternexus/foundation';

@Injectable()
export class SearchPipeline {
  constructor(
    private readonly parser: QueryParser,
    private readonly synonymService: SynonymService,
    @Inject('SearchEngineAdapter') private readonly searchEngine: SearchEngineAdapter,
    private readonly mapper: SearchResultMapper,
    private readonly analytics: SearchAnalytics
  ) {}

  async execute(input: SearchRequest): Promise<SearchResponse> {
    const ctx = Context.current();
    logger.info('Search pipeline executing', {
      requestId: ctx?.requestId,
      query: input.q,
    });

    // Parse query
    const tokens = this.parser.parse(input.q);

    // Expand synonyms
    const expandedTokens = await this.synonymService.expand(tokens);

    // Search
    const rawResults = await this.searchEngine.search(expandedTokens, {
      page: input.p || 1,
      limit: input.limit || 20,
    });

    // Map to DTOs
    const results = this.mapper.toDTO(rawResults);

    // Track analytics
    this.analytics.track({
      query: input.q,
      tokens,
      expandedTokens,
      resultCount: results.length,
    });

    return {
      query: input.q,
      results,
      total: results.length,
      page: input.p || 1,
      limit: input.limit || 20,
    };
  }
}

