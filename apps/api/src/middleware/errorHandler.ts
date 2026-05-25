import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError('Route not found', 404, 'NOT_FOUND'));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const normalizedError = error instanceof AppError ? error : new AppError('Internal server error');

  console.error('[API] error handler received error object:', error);
  console.error('[API] normalized error:', {
    message: normalizedError.message,
    code: normalizedError.code,
    statusCode: normalizedError.statusCode,
    details: normalizedError.details ?? null,
  });

  if (error instanceof Error && error.stack) {
    console.error('[API] stack trace:\n' + error.stack);
  }

  res.status(normalizedError.statusCode).json({
    success: false,
    error: normalizedError.message,
    code: normalizedError.code,
    details: normalizedError.details,
    timestamp: new Date().toISOString(),
  });
}