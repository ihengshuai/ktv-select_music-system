import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import md5 from "md5";
import svgCaptcha from "svg-captcha";

import { Cookie, HttpSignature, Token } from "@/common/decorator";
import { OriginalResponse } from "@/common/decorator/http.decorator";
import { AuthenticationGuard } from "@/common/guard/authentication-controller.guard";
import { CAPTCHA_COOKIE_KEY } from "@/constants/cookie.constants";
import { USER_ROLE, USER_STATUS } from "@/constants/user.constants";
import { QueryUserVO } from "@/modules/user/vo/query-user.vo";
import type { IToken } from "@/typings/application";
import { clearTokenCookie, setCaptchaCookie, setTokenCookie } from "@/utils";

import { UserService } from "../user/user.service";
import { UserLoginDTO } from "./dto/user-login.dto";
import { CreateUserDTO } from "../user/dto/create-user.dto";

@Controller("/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UserService
  ) {}

  @Get("")
  @UseGuards(AuthenticationGuard)
  async getAuth(@Token() token: IToken): Promise<QueryUserVO> {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    this.logger.log("获取用户信息成功");

    return new QueryUserVO(theUser.toJSON());
  }

  @Post("/login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Cookie(CAPTCHA_COOKIE_KEY) captcha: string,
    @Body() data: UserLoginDTO
  ) {
    if (captcha !== data.code) throw new BadRequestException({ error: "验证码错误" });

    const { username, password } = data;
    const theUser = await this.userService.findUser(username);

    if (theUser?.status === USER_STATUS.PENDING) throw new BadRequestException({ error: "账号未激活!" });
    if (theUser?.status === USER_STATUS.BANNED) throw new BadRequestException({ error: "账号已禁用!" });

    if (!theUser || !theUser.validatePassword(password)) throw new UnauthorizedException({ error: "账号或密码错误!" });

    const token = await this.jwtService.signAsync({
      id: theUser.id,
      username,
      level: theUser.level,
      status: theUser.status,
      uid: theUser.uid,
      expire: +new Date(),
    } as IToken);

    setTokenCookie(res, token);

    return true;
  }

  @Post("/register")
  async register(@Cookie(CAPTCHA_COOKIE_KEY) captcha: string, @Body("code") code, @Body() data: CreateUserDTO) {
    if (captcha !== code) throw new BadRequestException({ error: "验证码错误" });

    const { username, password } = data;

    /** 系统初始化创建默认root管理员 */
    if (await this.userService.isEmpty()) {
      await this.userService.addUser({
        ...data,
        password,
        username: "root",
        nickname: "超级管理员",
        status: USER_STATUS.ACTIVE,
        level: USER_ROLE.SUPER,
      });

      return true;
    }

    const theUser = await this.userService.findUser(username);

    if (theUser) {
      throw new BadRequestException({ error: "账号已存在!" });
    }

    await this.userService.addUser({
      ...data,
      username,
      password,
    });

    return true;
  }

  @Get("/logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    clearTokenCookie(res);

    return true;
  }

  @Get("/captcha")
  @Header("Content-Type", "image/svg+xml")
  @HttpSignature(false)
  @OriginalResponse()
  async getCaptcha(@Res({ passthrough: true }) res: Response) {
    const captcha = await svgCaptcha.createMathExpr({
      height: 36,
      width: 80,
      noise: 2,
      mathMin: 1,
      mathMax: 9,
      mathOperator: "+/-",
      background: "#efefef",
      color: true,
    });

    const captchaValue = captcha.text.toLowerCase();

    setCaptchaCookie(res, md5(captchaValue));

    return captcha.data;
  }
}
