import { Injectable } from '@nestjs/common';
import { SearchResultItem } from '@bosternexus/shared';

@Injectable()
export class SearchResultMapper {
  toDTO(items: SearchResultItem[]): SearchResultItem[] {
    return items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      imageUrl: item.imageUrl,
    }));
  }
}

