export interface IdempotencyRecord {
  key: string;
  result: unknown;
  createdAt: Date;
  expiresAt: Date;
}

export interface IdempotencyStore {
  get(key: string): Promise<IdempotencyRecord | null>;
  set(key: string, result: unknown, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private store: Map<string, IdempotencyRecord> = new Map();

  async get(key: string): Promise<IdempotencyRecord | null> {
    const record = this.store.get(key);
    if (!record) {
      return null;
    }

    if (record.expiresAt < new Date()) {
      this.store.delete(key);
      return null;
    }

    return record;
  }

  async set(key: string, result: unknown, ttlSeconds: number = 3600): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

    this.store.set(key, {
      key,
      result,
      createdAt: now,
      expiresAt,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export function computeIdempotencyKey(
  operation: string,
  ...params: unknown[]
): string {
  const paramsHash = JSON.stringify(params);
  return `${operation}:${Buffer.from(paramsHash).toString('base64url')}`;
}

