import { describe, it, expect } from "vitest";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateRequest, validateQuery } from "../validation.js";

describe("Validation Middleware", () => {
  it("should validate request body successfully", () => {
    const schema = z.object({
      name: z.string().min(2),
      age: z.number().min(0)
    });

    const req = {
      body: { name: "John", age: 30 }
    } as Request;
    
    const res = {} as Response;
    const next = () => {};

    const middleware = validateRequest(schema);
    middleware(req, res, next);
  });

  it("should validate query parameters successfully", () => {
    const schema = z.object({
      page: z.string().optional(),
      limit: z.string().optional()
    });

    const req = {
      query: { page: "1", limit: "10" }
    } as unknown as Request;
    
    const res = {} as Response;
    const next = () => {};

    const middleware = validateQuery(schema);
    middleware(req, res, next);
  });
});
