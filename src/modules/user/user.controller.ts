import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";

import { Role, Token } from "@/common/decorator";
import { AuthenticationGuard } from "@/common/guard/authentication-controller.guard";
import { AuthenticationLevelGuard } from "@/common/guard/authentication-level.guard";
import { USER_ROLE } from "@/constants/user.constants";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { ChangePwdDTO } from "@/modules/user/dto/change-pwd.dto";
import { QueryUserDTO } from "@/modules/user/dto/query-user.dto";
import { UpdateNicknameDTO } from "@/modules/user/dto/update-nickname.dto";
import type { IToken } from "@/typings/application";
import { clearTokenCookie } from "@/utils";

import { ChangeUserRoleDTO } from "./dto/change-role.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("")
  async createUser(@Body() data: CreateUserDTO) {
    return await this.userService.addUser(data);
  }

  @Get("")
  @UseGuards(AuthenticationGuard)
  async getUser(@Query("username") username: string) {
    const user = await this.userService.findUser(username);

    if (user) {
      delete user.password;
      return user;
    }

    return null;
  }

  @Get("users")
  @UseGuards(AuthenticationGuard, AuthenticationLevelGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async getUsers(@Query() query: QueryUserDTO, @Query() pagination: PaginationDTO) {
    return await this.userService.findAllUsers(query, pagination);
  }

  /** 改变用户状态 */
  @Post(":username")
  @UseGuards(AuthenticationGuard, AuthenticationLevelGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async toggleUserStatus(@Param("username") username: string, @Body("status") status: number) {
    return await this.userService.toggleUserStatus(username, status);
  }

  @Post(":username/change/role")
  @UseGuards(AuthenticationGuard, AuthenticationLevelGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async changeUserRole(@Param("username") username: string, @Token() token: IToken, @Body() body: ChangeUserRoleDTO) {
    const user = await this.userService.findUser(username);

    if (!user || user.level <= token.level) throw new BadRequestException({ error: "没有权限!" });

    return await this.userService.changeUserRole(username, body);
  }

  /** 重置密码 */
  @Post(":username/reset/pwd")
  @UseGuards(AuthenticationGuard, AuthenticationLevelGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async resetPassword(@Param("username") username: string, @Body("password") password: string) {
    return await this.userService.resetPassword(username, password);
  }

  /** 修改密码 */
  @Post("change/pwd")
  @UseGuards(AuthenticationGuard)
  async changePassword(
    @Res({ passthrough: true }) response: Response,
    @Token() token: IToken,
    @Body() payload: ChangePwdDTO
  ) {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    if (!theUser) throw new BadRequestException({ error: "用户不存在" });

    if (!theUser.validatePassword(payload.oldPassword)) throw new BadRequestException({ error: "旧密码错误" });

    const res = await this.userService.resetPassword(username, payload.newPassword);

    if (res) clearTokenCookie(response);

    return res;
  }

  /** 修改昵称 */
  @Post("update/nickname")
  @UseGuards(AuthenticationGuard)
  async updateNickname(@Token() token: IToken, @Body() payload: UpdateNicknameDTO) {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    if (!theUser) throw new BadRequestException({ error: "用户不存在" });

    return await this.userService.updateNickname(username, payload);
  }

  @Post("testing/capture-error")
  async testCaptureError() {
    const codes = [400, 401, 403, 404, 500, 502];
    throw new HttpException("测试错误", codes[Math.floor(Math.random() * codes.length)]);
  }
}
