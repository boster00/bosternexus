import { Injectable } from '@nestjs/common';
import { SearchOrchestrator } from './search.orchestrator';
import { SearchRequest, SearchResponse } from '@bosternexus/shared';
import { Context } from '../context/Context';
import { logger } from '@bosternexus/foundation';

@Injectable()
export class SearchFacade {
  constructor(private readonly orchestrator: SearchOrchestrator) {}

  async search(input: SearchRequest): Promise<SearchResponse> {
    const ctx = Context.current();
    logger.info('Search facade called', {
      requestId: ctx?.requestId,
      query: input.q,
    });

    return this.orchestrator.search(input);
  }
}

