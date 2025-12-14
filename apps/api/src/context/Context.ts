import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  requestId: string;
  sessionId?: string;
  userId?: string;
  locale?: string;
  attribution?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  tracking?: {
    [key: string]: unknown;
  };
}

class ContextManager {
  private static instance: ContextManager;
  private als: AsyncLocalStorage<RequestContext>;

  private constructor() {
    this.als = new AsyncLocalStorage<RequestContext>();
  }

  static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  run<T>(context: RequestContext, fn: () => T): T {
    return this.als.run(context, fn);
  }

  current(): RequestContext {
    const ctx = this.als.getStore();
    if (!ctx) {
      throw new Error('Context not initialized. Ensure ContextMiddleware is applied.');
    }
    return ctx;
  }

  currentOptional(): RequestContext | undefined {
    return this.als.getStore();
  }
}

export const Context = ContextManager.getInstance();

