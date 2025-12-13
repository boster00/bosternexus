export interface LogContext {
  requestId?: string;
  sessionId?: string;
  userId?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export class Logger {
  private redactPatterns: RegExp[] = [
    /password/i,
    /token/i,
    /secret/i,
    /api[_-]?key/i,
    /authorization/i,
  ];

  private redactValue(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.redactPatterns.some(pattern => pattern.test(value))
        ? '[REDACTED]'
        : value;
    }
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(v => this.redactValue(v));
      }
      const redacted: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        redacted[key] = this.redactValue(val);
      }
      return redacted;
    }
    return value;
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (context) {
      entry.context = this.redactValue(context) as LogContext;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  debug(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('debug', message, context);
    console.debug(JSON.stringify(entry));
  }

  info(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('info', message, context);
    console.info(JSON.stringify(entry));
  }

  warn(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('warn', message, context);
    console.warn(JSON.stringify(entry));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const entry = this.createLogEntry('error', message, context, error);
    console.error(JSON.stringify(entry));
  }
}

export const logger = new Logger();

