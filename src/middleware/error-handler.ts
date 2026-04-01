import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${err.message}`);

  const response: Record<string, unknown> = {
    error: { message, statusCode },
  };

  if (process.env.NODE_ENV === "development") {
    response.error = { message, statusCode, stack: err.stack };
  }

  res.status(statusCode).json(response);
}
