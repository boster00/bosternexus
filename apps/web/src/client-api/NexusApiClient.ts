import { SearchRequest, SearchResponse, CreateTransactionRequest, CreateTransactionResponse, HealthResponse } from '@bosternexus/shared';

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
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API request failed: ${response.status} ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async search(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request<SearchResponse>(`/search?${params.toString()}`);
  }

  async startTransaction(
    purpose: CreateTransactionRequest['purpose'],
    idempotencyKey: string,
    metadata?: Record<string, unknown>
  ): Promise<CreateTransactionResponse> {
    if (!idempotencyKey) {
      throw new Error('Idempotency key is required');
    }

    return this.request<CreateTransactionResponse>('/transactions/start', {
      method: 'POST',
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        purpose,
        metadata: metadata || {},
      }),
    });
  }
}

export const nexusApiClient = new NexusApiClient();

