import { Injectable, Logger, /*Logger, */ NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const startTime = new Date();
    const method = req.method;
    const url = req.originalUrl;

    res.on("finish", () => {
      this.logger.log(
        `${method?.toUpperCase()}: ${url}  耗时: ${((+new Date() - +new Date(startTime)) / 1000)?.toFixed(3)}s\n`
      );
    });
    next();
  }
}
