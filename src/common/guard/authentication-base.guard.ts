import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";

import { IAppConfig, IConfig } from "@/config";
import { USER_STATUS } from "@/consts";
import { BUSINESS_ERROR_CODE } from "@/consts/response-status.const";
import { UserService } from "@/modules/user/user.service";
import type { IToken } from "@/typings/application";
import { clearTokenCookie, setTokenCookie } from "@/utils";

@Injectable()
export class AuthenticationBaseGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationBaseGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService<IConfig>
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp();
    const req = request.getRequest<Request>();
    const res = request.getResponse<Response>();

    const { TOKEN_COOKIE, HAVE_ROOT } = this.config.get<IAppConfig>("APP_CONFIG");

    if (!HAVE_ROOT) throw new HttpException("请先初始化系统", BUSINESS_ERROR_CODE.SYSTEM_NOT_INIT);

    const token = req.cookies[TOKEN_COOKIE];

    if (!token) throw new UnauthorizedException("请先登录");

    try {
      const jwtToken: IToken = await this.jwtService.verifyAsync(token);

      if (+new Date() - jwtToken.expire > 1000 * 60 * 5) {
        const theUser = await this.userService.findUser(jwtToken.username);

        if (!theUser || theUser.status !== USER_STATUS.ACTIVE) {
          clearTokenCookie(res);

          throw new UnauthorizedException("请先登录");
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

      req.__token__ = jwtToken;

      if (!jwtToken) throw new UnauthorizedException("请先登录");

      return true;
    } catch (error) {
      this.logger.error(error);

      throw new UnauthorizedException("请先登录");
    }
  }
}
