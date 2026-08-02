import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { IConfig, IAppConfig } from "@/config";
import { USER_ROLE_LABEL } from "@/consts";
import { BUSINESS_ERROR_CODE } from "@/consts/response-status.const";

@Injectable()
export class AuthenticationRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly config: ConfigService<IConfig>) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp();
    const req = request.getRequest<Request>();
    const token = req["__token__"];
    const { HAVE_ROOT } = this.config.get<IAppConfig>("APP_CONFIG");

    if (!HAVE_ROOT) throw new HttpException("请先初始化系统", BUSINESS_ERROR_CODE.SYSTEM_NOT_INIT);

    if (!token) throw new UnauthorizedException("请先登录");

    const roles =
      this.reflector.get<number[]>(USER_ROLE_LABEL, ctx.getHandler()) ||
      this.reflector.get<number[]>(USER_ROLE_LABEL, ctx.getClass()) ||
      [];

    const { level } = token;

    const hasLevel = roles.includes(level);

    if (!hasLevel) throw new ForbiddenException("禁止访问");

    return hasLevel;
  }
}
