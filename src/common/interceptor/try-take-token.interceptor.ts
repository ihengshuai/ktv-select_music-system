import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { IConfig } from "@/config";
import type { IToken } from "@/typings/application";

/**
 * 尝试获取token
 * @description 主要服务于不需要鉴权接口场景
 */
@Injectable()
export class TryTakeTokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService, private readonly config: ConfigService<IConfig>) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp();
    const req = request.getRequest<Request>();

    if (!!req.__token__) return next.handle();

    const TOKEN_COOKIE = this.config.get<string>("APP_CONFIG.TOKEN_COOKIE");

    const token = req.cookies[TOKEN_COOKIE];

    if (!token) return next.handle();

    try {
      const jwtToken = await this.jwtService.verifyAsync<IToken>(token);

      if (+new Date() - jwtToken.expire > 1000 * 60 * 5) {
        // ...
      } else {
        req.__token__ = jwtToken;
      }
    } finally {
      return next.handle();
    }
  }
}
