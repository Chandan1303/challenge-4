import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (process.env.NODE_ENV !== "test") {
    console.error("Application error:", {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  if ("statusCode" in err && typeof err.statusCode === "number") {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found"
  });
}
