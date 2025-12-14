import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SearchFacade } from './search.facade';
import { SearchRequest, SearchRequestSchema, SearchResponse } from '@bosternexus/shared';

@Controller('search')
export class SearchController {
  constructor(private readonly searchFacade: SearchFacade) {}

  @Get()
  async search(@Query() query: unknown): Promise<SearchResponse> {
    // Strict validation with Zod
    const validationResult = SearchRequestSchema.safeParse(query);
    
    if (!validationResult.success) {
      throw new BadRequestException({
        message: 'Invalid search parameters',
        errors: validationResult.error.errors,
      });
    }

    const validatedRequest: SearchRequest = validationResult.data;
    return this.searchFacade.search(validatedRequest);
  }
}

