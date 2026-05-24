import type { NextFunction, Request, Response } from 'express';
import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from './errorHandler';

export function validateRequest<TBody>(schema: ZodType<TBody>): RequestHandler<Record<string, string>, unknown, TBody> {
  return (req: Request<Record<string, string>, unknown, TBody>, _res: Response, next: NextFunction) => {
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
