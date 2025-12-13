import { Logger, logger } from '../logger/Logger';
import { AppError, ErrorCode } from '../errors/AppError';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
}

export interface Response<T = unknown> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

export abstract class ExternalApiClient {
  protected logger: Logger;
  protected baseUrl: string;
  protected defaultTimeout: number;
  protected defaultRetries: number;

  constructor(
    baseUrl: string,
    defaultTimeout: number = 30000,
    defaultRetries: number = 3
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = defaultTimeout;
    this.defaultRetries = defaultRetries;
    this.logger = logger;
  }

  protected async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected async request<T = unknown>(
    path: string,
    options: RequestOptions = {}
  ): Promise<Response<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
    } = options;

    const url = `${this.baseUrl}${path}`;
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.info('External API request', {
      requestId,
      method,
      url,
      hasBody: !!body,
    });

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          signal: controller.signal,
        };

        if (body) {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        let data: T;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        if (!response.ok) {
          throw new AppError(
            ErrorCode.EXTERNAL_API_ERROR,
            `API request failed: ${response.status} ${response.statusText}`,
            { status: response.status, statusText: response.statusText }
          );
        }

        this.logger.info('External API response', {
          requestId,
          status: response.status,
        });

        return {
          status: response.status,
          statusText: response.statusText,
          data,
          headers: responseHeaders,
        };
      } catch (error) {
        lastError = error as Error;

        if (error instanceof Error && error.name === 'AbortError') {
          throw new AppError(
            ErrorCode.EXTERNAL_API_TIMEOUT,
            `Request timeout after ${timeout}ms`,
            { url, timeout },
            error
          );
        }

        if (attempt < retries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          this.logger.warn('Retrying request', {
            requestId,
            attempt: attempt + 1,
            retries,
            backoffMs,
          });
          await this.sleep(backoffMs);
        }
      }
    }

    this.logger.error('External API request failed after retries', lastError!, {
      requestId,
      retries,
    });

    throw new AppError(
      ErrorCode.EXTERNAL_API_ERROR,
      `Request failed after ${retries} retries`,
      { url, retries },
      lastError!
    );
  }
}

