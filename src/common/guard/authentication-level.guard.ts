import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { USER_ROLE_LABEL } from "@/constants/user.constants";
import { IToken } from "@/typings/application";

@Injectable()
export class AuthenticationLevelGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp();
    const req = request.getRequest<Request>();
    const token = req["__token__"] as IToken;

    if (!token) throw new UnauthorizedException({ error: "请先登录!" });

    const roles =
      this.reflector.get<number[]>(USER_ROLE_LABEL, ctx.getHandler()) ||
      this.reflector.get<number[]>(USER_ROLE_LABEL, ctx.getClass()) ||
      [];

    const { level } = token;

    return roles.includes(level);
  }
}
