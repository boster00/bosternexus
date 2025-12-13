import { Injectable } from '@nestjs/common';

@Injectable()
export class SynonymService {
  private synonymMap: Record<string, string[]> = {
    'bdnf': ['brain-derived neurotrophic factor', 'bdnf protein'],
    'elisa': ['enzyme-linked immunosorbent assay'],
    'antibody': ['ab', 'immunoglobulin', 'ig'],
  };

  async expand(tokens: string[]): Promise<string[]> {
    const expanded: string[] = [];
    
    for (const token of tokens) {
      expanded.push(token);
      if (this.synonymMap[token]) {
        expanded.push(...this.synonymMap[token]);
      }
    }

    return [...new Set(expanded)];
  }
}

