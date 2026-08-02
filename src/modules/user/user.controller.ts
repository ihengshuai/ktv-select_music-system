import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { Role, Token } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
// import { RequiredPipe } from "@/common/pipe/required.pipe";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { ChangePwdDTO } from "@/modules/user/dto/change-pwd.dto";
import { QueryUserDTO } from "@/modules/user/dto/query-user.dto";
import { UpdateNicknameDTO } from "@/modules/user/dto/update-nickname.dto";
import type { IToken } from "@/typings/application";
import { clearTokenCookie } from "@/utils";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { ChangeUserRoleDTO, ChangeUserStatusDTO } from "./dto/change-role.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

@ApiTags("用户管理")
@Controller("/user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   */
  @ApiOperation({ summary: "创建用户" })
  @ApiModelResponse(UserEntity)
  @Post("")
  async createUser(@Body() data: CreateUserDTO) {
    const res = await this.userService.addUser(data);
    this.logger.log(`创建用户成功: ${res.username}`);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 获取用户详情
   */
  @ApiOperation({ summary: "获取用户详情" })
  @ApiModelResponse(UserEntity)
  @Get("")
  @UseGuards(AuthenticationBaseGuard)
  async getUser(@Query("username") username: string) {
    const user = await this.userService.findUser(username);

    return BaseModelResponseVO.success(user);
  }

  /**
   * 获取用户列表
   */
  @ApiOperation({ summary: "获取用户列表" })
  @ApiListResponse(UserEntity)
  @Get("users")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async getUsers(@Query() query: QueryUserDTO, @Query() pagination: PaginationDTO) {
    const res = await this.userService.findAllUsers(query, pagination);

    return BaseListResponseVO.success(res.items, res.pager);
  }

  /**
   * 改变用户状态
   */
  @ApiOperation({ summary: "改变用户状态" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @Post(":username")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  // async toggleUserStatus(@Param("username") username: string, @Body("status", new RequiredPipe()) status: number) {
  async toggleUserStatus(@Param("username") username: string, @Body() data: ChangeUserStatusDTO) {
    const res = await this.userService.toggleUserStatus(username, data.status);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 改变用户角色
   */
  @ApiOperation({ summary: "改变用户角色" })
  @Post(":username/change/role")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async changeUserRole(@Param("username") username: string, @Token() token: IToken, @Body() body: ChangeUserRoleDTO) {
    const user = await this.userService.findUser(username);

    if (!user || user.level <= token.level) throw new BadRequestException("没有权限操作");

    const res = await this.userService.changeUserRole(username, body);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 重置密码
   */
  @ApiOperation({ summary: "管理员重置密码" })
  @ApiBody({
    schema: { type: "object", properties: { password: { type: "string", description: "重置后的密码" } } },
  })
  @Post(":username/reset/pwd")
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  async resetPassword(@Param("username") username: string, @Body("password") password: string) {
    const res = await this.userService.resetPassword(username, password);

    return BaseModelResponseVO.success(res);
  }

  /** 修改密码 */
  @ApiOperation({ summary: "修改账号密码" })
  @Post("change/pwd")
  @UseGuards(AuthenticationBaseGuard)
  async changePassword(
    @Res({ passthrough: true }) response: Response,
    @Token() token: IToken,
    @Body() payload: ChangePwdDTO
  ) {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    if (!theUser) throw new BadRequestException("用户不存在");

    if (!theUser.validatePassword(payload.oldPassword)) throw new BadRequestException("旧密码错误");

    const res = await this.userService.resetPassword(username, payload.newPassword);

    if (res) clearTokenCookie(response);

    return BaseModelResponseVO.success(res);
  }

  /** 修改昵称 */
  @ApiOperation({ summary: "修改账号昵称" })
  @Post("update/nickname")
  @UseGuards(AuthenticationBaseGuard)
  async updateNickname(@Token() token: IToken, @Body() payload: UpdateNicknameDTO) {
    const { username } = token;
    const theUser = await this.userService.findUser(username);

    if (!theUser) throw new BadRequestException({ error: "用户不存在" });

    const res = await this.userService.updateNickname(username, payload);

    return BaseModelResponseVO.success(res);
  }

  /** 测试错误 */
  @ApiExcludeEndpoint()
  @Post("testing/capture-error")
  async testCaptureError() {
    const codes = [400, 401, 403, 404, 500, 502];
    throw new HttpException("测试错误", codes[Math.floor(Math.random() * codes.length)]);
  }
}
