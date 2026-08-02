import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import { QueryFailedError, TypeORMError } from "typeorm";

/**
 * db异常处理
 * @description db异常处理
 */
@Catch(TypeORMError)
export class DbExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DbExceptionFilter.name);

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

  private getCode(exception: TypeORMError) {
    if (exception instanceof QueryFailedError) return HttpStatus.BAD_REQUEST;

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: Error) {
    return exception.message || "Internal Server Error";
  }

  private getErrorStack(exception: Error) {
    const stack = exception.stack;

    return stack
      .replace(/\(.*\)/g, " ")
      .split("\n")
      .slice(0, 1)
      .join("\n");
  }
}
