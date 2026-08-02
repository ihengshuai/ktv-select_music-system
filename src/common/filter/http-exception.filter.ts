import { createReadStream } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import dayjs from "dayjs";
import { Request, Response } from "express";

import { IConfig } from "@/config";
import { DATE_FORMAT } from "@/consts";

import { ValidatorException } from "./exception/exception";

/**
 * 异常处理
 * @description HTTP异常、校验异常、数据库异常等等
 */
@Catch(HttpException, ValidatorException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly config: ConfigService<IConfig>) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { __is_Dev__, CLIENT_OUTDIR, API_PREFIX } = this.config.get("APP_CONFIG");

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const code = this.getCode(exception);
    const message = this.getMessage(exception);
    const stack = this.getErrorStack(exception);

    // 定义错误格式
    const error = {
      code,
      message,
      error: stack,
      timestamp: dayjs().format(DATE_FORMAT.DATE_FULLTIME),
    };

    // 根据api前缀判断是否是api请求
    const regexp = new RegExp(`^(${API_PREFIX}).*`, "i");
    const isAccessPage = !regexp.test(request.originalUrl);

    // 如果是页面访问
    if (isAccessPage) {
      const clientPage = createReadStream(resolve(cwd(), __is_Dev__ ? "./index.html" : `${CLIENT_OUTDIR}/index.html`));

      return clientPage.pipe(response);
    }

    this.logger.error(exception.stack);

    try {
      response.status(HttpStatus.OK).json({ ...error });
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
    if (exception instanceof HttpException) {
      const errorException = exception?.getResponse?.();

      // if (this.getCode(exception) === HttpStatus.NOT_FOUND) return "Not Found";

      return typeof errorException === "string" ? errorException : (errorException as any)?.message; // { message: xxx, error: xxx, statusCode: xxx }
    }

    if (exception instanceof ValidatorException) return exception.message;

    return "Internal Server Error";
  }

  private getErrorStack(exception: Error) {
    const stack = exception.stack;

    return stack
      .replace(/\(.*\)/g, " ")
      .split("\n")
      .slice(0, 2)
      .join("\n");
  }
}
