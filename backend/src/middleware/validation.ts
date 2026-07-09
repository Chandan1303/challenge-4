import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation Error",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
}
