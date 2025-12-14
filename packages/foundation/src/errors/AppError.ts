export enum ErrorCode {
  // Generic
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // External API
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  EXTERNAL_API_TIMEOUT = 'EXTERNAL_API_TIMEOUT',
  
  // Business
  INVALID_STATE = 'INVALID_STATE',
  DUPLICATE_OPERATION = 'DUPLICATE_OPERATION',
}

export interface ErrorDetails {
  [key: string]: unknown;
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: ErrorDetails,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      ...(this.cause && { cause: this.cause.message }),
    };
  }
}

