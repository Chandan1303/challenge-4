import { describe, it, expect } from "vitest";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, errorHandler, notFoundHandler } from "../errorHandler.js";

describe("Error Handler Middleware", () => {
  it("should handle AppError with correct status code", () => {
    const req = {} as unknown as Request;
    const res = {
      status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      json: (data: any) => data
    } as unknown as Response;
    const next = () => {};

    const error = new AppError(404, "Not Found");
    errorHandler(error, req, res, next);

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Not Found");
  });

  it("should handle ZodError with validation details", () => {
    const req = {} as unknown as Request;
    const res = {
      status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      json: (data: any) => data
    } as unknown as Response;
    const next = () => {};

    const error = new ZodError([]);
    errorHandler(error, req, res, next);
  });

  it("should handle generic errors with 500 status", () => {
    const req = {} as unknown as Request;
    const res = {
      status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      json: (data: any) => data
    } as unknown as Response;
    const next = () => {};

    const error = new Error("Internal Error");
    errorHandler(error, req, res, next);
  });

  it("should return 404 for not found handler", () => {
    const req = {} as unknown as Request;
    const res = {
      status: (code: number) => ({ json: (data: any) => ({ code, data }) }),
      json: (data: any) => data
    } as unknown as Response;

    notFoundHandler(req, res);
  });
});
