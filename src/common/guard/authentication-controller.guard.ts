import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

import { IConfig } from "@/config";
import { USER_STATUS } from "@/constants/user.constants";
import { UserService } from "@/modules/user/user.service";
import type { IToken } from "@/typings/application";
import { clearTokenCookie, setTokenCookie } from "@/utils";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService<IConfig>
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp();
    const req = request.getRequest<Request>();
    const res = request.getResponse<Response>();

    const TOKEN_COOKIE = this.config.get<string>("APP_CONFIG.TOKEN_COOKIE");

    const token = req.cookies[TOKEN_COOKIE];

    if (!token) return false;

    try {
      const jwtToken: IToken = await this.jwtService.verifyAsync(token);

      if (+new Date() - jwtToken.expire > 1000 * 60 * 5) {
        const theUser = await this.userService.findUser(jwtToken.username);

        if (!theUser || theUser.status !== USER_STATUS.ACTIVE) {
          clearTokenCookie(res);
          return false;
        }

        const token = await this.jwtService.signAsync({
          id: theUser.id,
          username: theUser.username,
          level: theUser.level,
          status: theUser.status,
          expire: +new Date(),
          uid: theUser.uid,
        } as IToken);

        setTokenCookie(res, token);
      }

      // @ts-ignore
      req.__token__ = jwtToken;

      return !!jwtToken;
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException({ error: "请先登录!" });
    }
  }
}
