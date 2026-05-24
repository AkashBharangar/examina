import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from './errorHandler';

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError('Validation failed', 400, 'VALIDATION_ERROR', {
          issues: result.error.flatten(),
        }),
      );
    }

    req.body = result.data;
    return next();
  };
}