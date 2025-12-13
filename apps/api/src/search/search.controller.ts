import { Controller, Get, Query } from '@nestjs/common';
import { SearchFacade } from './search.facade';
import { SearchRequest, SearchResponse } from '@bosternexus/shared';

@Controller('search')
export class SearchController {
  constructor(private readonly searchFacade: SearchFacade) {}

  @Get()
  async search(@Query() query: SearchRequest): Promise<SearchResponse> {
    return this.searchFacade.search(query);
  }
}

