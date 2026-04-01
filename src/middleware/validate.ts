import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
    }
  }
}

export const validate =
  (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          details: result.error.flatten(),
        },
      });
      return;
    }
    req.validated = result.data;
    next();
  };
