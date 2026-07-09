import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent")
    };
    
    if (res.statusCode >= 400 || process.env.NODE_ENV === "development") {
      const writer = res.statusCode >= 400 ? console.warn : console.info;
      writer("request", logData);
    }
  });
  
  next();
}
