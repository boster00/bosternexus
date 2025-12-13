export interface SearchRequest {
  q: string;
  p?: number;
  limit?: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: number;
  imageUrl?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
}

