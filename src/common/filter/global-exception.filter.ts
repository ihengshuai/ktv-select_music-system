import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

import { ValidatorException } from "./exception/exception";

/**
 * 异常兜底处理
 * @description 异常兜底处理
 */
@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const code = this.getCode(exception);
    const message = this.getMessage(exception);
    const stack = this.getErrorStack(exception);

    try {
      this.logger.error(stack);

      response.status(HttpStatus.OK).json({ code, message, error: stack });
    } catch (error) {
      response.end();
    }
  }

  private getCode(exception: Error) {
    if (exception instanceof HttpException) return exception.getStatus();

    if (exception instanceof ValidatorException) return HttpStatus.BAD_REQUEST;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: Error) {
    return exception.message || "Internal Server Error";
  }

  private getErrorStack(exception: Error) {
    const stack = exception.stack;

    return stack;
    // .replace(/\(.*\)/g, " ")
    // .split("\n")
    // .slice(0, 2)
    // .join("\n");
  }
}
