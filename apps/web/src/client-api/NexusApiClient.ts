import { SearchRequest, SearchResponse } from '@bosternexus/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class NexusApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async search(input: SearchRequest): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: input.q,
      ...(input.p && { p: input.p.toString() }),
      ...(input.limit && { limit: input.limit.toString() }),
    });

    return this.request<SearchResponse>(`/search?${params.toString()}`);
  }
}

export const nexusApiClient = new NexusApiClient();

