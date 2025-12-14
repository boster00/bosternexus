import { logger } from '../logger/Logger';
import { AppError, ErrorCode } from '../errors/AppError';

export interface ExternalApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export class ExternalApiClient {
  protected config: Required<Omit<ExternalApiClientConfig, 'headers'>> & {
    headers: Record<string, string>;
  };

  constructor(config: ExternalApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      headers: config.headers ?? {},
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers,
      },
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        logger.debug('External API request', {
          url,
          method: options.method || 'GET',
          attempt: attempt + 1,
        });

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new AppError(
            ErrorCode.EXTERNAL_API_ERROR,
            `API request failed: ${response.status} ${response.statusText}`,
            { url, status: response.status, body: errorText }
          );
        }

        const data = await response.json();
        logger.debug('External API response', {
          url,
          status: response.status,
        });

        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof Error && error.name === 'AbortError') {
          throw new AppError(
            ErrorCode.EXTERNAL_API_TIMEOUT,
            `Request timeout after ${this.config.timeout}ms`,
            { url }
          );
        }

        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          logger.warn('External API request failed, retrying', {
            url,
            attempt: attempt + 1,
            delay,
            error: lastError.message,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw lastError instanceof AppError
          ? lastError
          : new AppError(
              ErrorCode.EXTERNAL_API_ERROR,
              `External API request failed after ${this.config.retries + 1} attempts`,
              { url },
              lastError
            );
      }
    }

    throw lastError || new Error('Unexpected error');
  }
}

