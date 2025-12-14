import { Injectable } from '@nestjs/common';
import { SearchResultItem } from '@bosternexus/shared';

export interface SearchOptions {
  page: number;
  limit: number;
}

export interface SearchEngineAdapter {
  search(tokens: string[], options: SearchOptions): Promise<SearchResultItem[]>;
}

@Injectable()
export class MockSearchEngineAdapter implements SearchEngineAdapter {
  private mockData: SearchResultItem[] = [
    {
      id: '1',
      title: 'BDNF ELISA Kit',
      description: 'High sensitivity ELISA kit for BDNF detection',
      category: 'ELISA Kits',
      price: 299.99,
      imageUrl: 'https://example.com/images/bdnf-elisa.jpg',
    },
    {
      id: '2',
      title: 'BDNF Antibody',
      description: 'Monoclonal antibody against BDNF',
      category: 'Antibodies',
      price: 149.99,
      imageUrl: 'https://example.com/images/bdnf-antibody.jpg',
    },
    {
      id: '3',
      title: 'Recombinant BDNF Protein',
      description: 'Recombinant human BDNF protein',
      category: 'Proteins',
      price: 199.99,
      imageUrl: 'https://example.com/images/bdnf-protein.jpg',
    },
  ];

  async search(tokens: string[], options: SearchOptions): Promise<SearchResultItem[]> {
    // Simple mock: filter by tokens matching title/description
    const query = tokens.join(' ').toLowerCase();
    const filtered = this.mockData.filter(item => {
      const searchable = `${item.title} ${item.description}`.toLowerCase();
      return tokens.some(token => searchable.includes(token));
    });

    // Paginate
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;
    return filtered.slice(start, end);
  }
}

