import { createReadStream } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import dayjs from "dayjs";
import { Request, Response } from "express";

import { IConfig } from "@/config";
import { DateFormat } from "@/constants";

@Catch()
export class HttpFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpFilter.name);

  constructor(private readonly config: ConfigService<IConfig>) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { __is_Dev__, CLIENT_OUTDIR } = this.config.get("APP_CONFIG");
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorException = exception instanceof HttpException ? exception?.getResponse?.() : exception;

    // 定义错误格式
    const error = {
      code,
      message: typeof errorException === "string" ? errorException : (errorException as any)?.message || errorException,
      error: (errorException as any)?.error,
      timestamp: dayjs().format(DateFormat.DATE_FULLTIME),
    };

    // 访问的是页面时渲染错误页面
    const regexp = new RegExp(`^(${this.config.get("APP_CONFIG.API_PREFIX")}).*`, "i");
    const isAccessPage = !regexp.test(request.originalUrl);
    if (isAccessPage) {
      // return response.render("exception/index", {
      //   code,
      //   message: error.message || error.error,
      // });
      const isDev = __is_Dev__;
      const CLIENT_DIR = CLIENT_OUTDIR;
      const clientPage = createReadStream(resolve(cwd(), isDev ? "./index.html" : `${CLIENT_DIR}/index.html`));
      return clientPage.pipe(response);
    }

    this.logger.error(exception.stack);

    try {
      response.status(200).json({ ...error });
    } catch (error) {
      response.end();
    }
  }
}
