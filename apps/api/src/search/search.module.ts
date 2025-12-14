import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchFacade } from './search.facade';
import { SearchOrchestrator } from './search.orchestrator';
import { SearchPipeline } from './search.pipeline';
import { QueryParser } from './query-parser';
import { SynonymService } from './synonym.service';
import { MockSearchEngineAdapter } from './search-engine.adapter';
import { SearchResultMapper } from './search-result.mapper';
import { SearchAnalytics } from './search-analytics';

@Module({
  controllers: [SearchController],
  providers: [
    SearchFacade,
    SearchOrchestrator,
    SearchPipeline,
    QueryParser,
    SynonymService,
    MockSearchEngineAdapter,
    { provide: 'SearchEngineAdapter', useClass: MockSearchEngineAdapter },
    SearchResultMapper,
    SearchAnalytics,
  ],
})
export class SearchModule {}

