import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error-handler.js";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error instanceof ZodError
        ? result.error.issues.map((i) => i.message).join(", ")
        : "Validation failed";
      return next(new AppError(message, 400));
    }
    req.body = result.data;
    next();
  };
}
