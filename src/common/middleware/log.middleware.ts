import { uuid } from "@hengshuai/helper";
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const startTime = new Date();
    const method = req.method;
    const url = req.originalUrl;
    const requestId = uuid();

    res.setHeader("X-Request-Id", requestId);

    res.on("finish", () => {
      this.logger.log(
        `${method?.toUpperCase()}: ${url}  耗时: ${((+new Date() - +new Date(startTime)) / 1000)?.toFixed(
          3
        )}s  RequestId: ${requestId} \n`
      );
    });

    next();
  }
}
