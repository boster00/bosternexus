import { Injectable } from '@nestjs/common';
import { SearchPipeline } from './search.pipeline';
import { SearchRequest, SearchResponse } from '@bosternexus/shared';
import { Context } from '../context/Context';
import { logger } from '@bosternexus/foundation';

@Injectable()
export class SearchOrchestrator {
  constructor(private readonly pipeline: SearchPipeline) {}

  async search(input: SearchRequest): Promise<SearchResponse> {
    const ctx = Context.current();
    logger.info('Search orchestrator called', {
      requestId: ctx.requestId,
      query: input.q,
    });

    return this.pipeline.execute(input);
  }
}

