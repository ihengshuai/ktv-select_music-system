import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";

import { AuthenticationRouteKey } from "../decorator";

/**
 * 控制某个路由守卫
 */
@Injectable()
export class AuthenticationRouteGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isRouteAuthenrication = this.reflector.get(AuthenticationRouteKey, context.getHandler());
    // 判断当前请求路由不需要鉴权直接放行
    if (!isRouteAuthenrication) return true;
    // TODO: 需要鉴权的这里简单的使用 authorization 头值是否等于route进行判断
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const key = request.headers.authorization;
    if (key !== "route") {
      throw new UnauthorizedException("401, 请先登录再访问！");
    }
    return true;
  }
}
