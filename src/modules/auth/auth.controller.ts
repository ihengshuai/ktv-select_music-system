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
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import md5 from "md5";
import svgCaptcha from "svg-captcha";
import { Transactional } from "typeorm-transactional";

import { Cookie, HttpSignature, Token } from "@/common/decorator";
import { NoWrapResponse } from "@/common/decorator/http.decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { ApiModelResponse } from "@/common/swagger";
import { toggleSystemInitStatus } from "@/config";
import { CAPTCHA_COOKIE_KEY, USER_ROLE, USER_STATUS } from "@/consts";
import { QueryUserVO } from "@/modules/user/vo/query-user.vo";
import type { IToken } from "@/typings/application";
import { clearCaptchaCookie, clearTokenCookie, setCaptchaCookie, setTokenCookie } from "@/utils";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { UserService } from "../user/user.service";
import { OrderLoginDTO, UserLoginDTO } from "./dto/user-login.dto";
import { OrderService } from "../order/order.service";
import { CreateUserDTO } from "../user/dto/create-user.dto";

@ApiTags("认证")
@Controller("/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UserService,

    private readonly orderService: OrderService
  ) {}

  @ApiOperation({ summary: "获取当前用户信息" })
  @ApiModelResponse(QueryUserVO)
  @Get("")
  @UseGuards(AuthenticationBaseGuard)
  async getAuth(@Token() token: IToken): Promise<QueryUserVO> {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    this.logger.log("获取用户信息成功");

    return new QueryUserVO(theUser.toJSON());
  }

  @ApiOperation({ summary: "登录" })
  @Post("/login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Cookie(CAPTCHA_COOKIE_KEY) captcha: string,
    @Body() data: UserLoginDTO
  ) {
    if (captcha !== data.code) throw new BadRequestException("验证码错误");

    const { username, password } = data;
    const theUser = await this.userService.findUser(username);

    if (theUser?.status === USER_STATUS.PENDING) throw new BadRequestException("账号未激活");
    if (theUser?.status === USER_STATUS.BANNED) throw new BadRequestException("账号已禁用");

    if (!theUser || !theUser.validatePassword(password)) throw new UnauthorizedException("账号或密码错误");

    const token = await this.jwtService.signAsync({
      id: theUser.id,
      username,
      level: theUser.level,
      status: theUser.status,
      uid: theUser.uid,
      expire: +new Date(),
    } as IToken);

    setTokenCookie(res, token);
    clearCaptchaCookie(res);

    return BaseModelResponseVO.success(true);
  }

  @ApiOperation({ summary: "前台用户下单登录" })
  @Post("/order-login")
  async orderLogin(@Res({ passthrough: true }) res: Response, @Body() data: OrderLoginDTO) {
    const { orderNo, password } = data;
    const order = await this.orderService.getOrderDetail(orderNo);

    if (order?.password !== password) throw new UnauthorizedException("无效的订单凭证！");

    return BaseModelResponseVO.success(order);
  }

  @ApiOperation({ summary: "注册" })
  @ApiResponse({ status: 200, type: Boolean })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "用户名",
        },
        password: {
          type: "string",
          description: "密码",
        },
        code: {
          type: "string",
          description: "验证码",
        },
      },
    },
  })
  @Post("/register")
  async register(@Cookie(CAPTCHA_COOKIE_KEY) captcha: string, @Body("code") code: string, @Body() data: CreateUserDTO) {
    if (captcha !== code) throw new BadRequestException("验证码错误");

    const { username, password } = data;

    const theUser = await this.userService.findUser(username);

    if (theUser) {
      throw new BadRequestException("账号已存在");
    }

    await this.userService.addUser({
      ...data,
      username,
      password,
    });

    return BaseModelResponseVO.success(true);
  }

  @ApiOperation({ summary: "登出" })
  @Get("/logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    clearTokenCookie(res);

    return BaseModelResponseVO.success(true);
  }

  @ApiOperation({ summary: "获取验证码" })
  @ApiResponse({
    status: 200,
    content: {
      "image/svg+xml": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @Get("/captcha")
  @Header("Content-Type", "image/svg+xml")
  @HttpSignature(false)
  @NoWrapResponse()
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

  /**
   * 系统初始化
   */
  @ApiExcludeEndpoint()
  @Transactional()
  @Post("/system-init")
  async systemInit(
    @Cookie(CAPTCHA_COOKIE_KEY) captcha: string,
    @Body("code") code: string,
    @Body() data: CreateUserDTO
  ) {
    if (captcha !== code) throw new BadRequestException("验证码错误");

    const { username, password } = data;

    const isEmpty = await this.userService.isEmpty();

    if (!isEmpty) throw new BadRequestException("系统已初始化");

    await this.userService.addUser({
      ...data,
      username,
      password,
      level: USER_ROLE.SUPER,
      status: USER_STATUS.ACTIVE,
      nickname: "超级管理员",
    });

    const rootText = `${username}|${password}`;
    await toggleSystemInitStatus(rootText);

    return BaseModelResponseVO.success(true);
  }
}
