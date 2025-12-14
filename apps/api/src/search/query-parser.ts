import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryParser {
  parse(query: string): string[] {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(token => token.length > 0);
  }
}

