import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Get, Post } from "@/helper/request/controller/http-controller";
import { CaptureError } from "@/helper/request/http-error/capture-error";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type { IChangePassword, IUserInfo, IUserInfoUpdateDTO, IUserListFilter } from "@/typings/models/user";

import { TestCaptureError } from "./error-enum";

/** 用户控制器 */
@Controller("/user")
export class UserController extends BaseController {
  /** 获取用户详情 */
  @Get("/{userId}")
  fetchUserDetail(userId: any, config?: IHttpRequestConfig) {
    return this.send<IUserInfo>({
      urlPath: { userId },
      retryCount: 2,
      ...config,
    });
  }

  /** 获取用户列表 */
  @Get("/users")
  fetchUsers(params?: IListQuery<IUserListFilter>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IUserInfo>>({
      params,
      label: "请求用户列表",
      ...config,
    });
  }

  /** 改变用户状态 */
  @Post("/{username}")
  toggleUserStatus(username: string, status: USER_STATUS, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { username },
      data: { status },
      ...config,
    });
  }

  /** 改变用户角色 */
  @Post("/{username}/change/role")
  toggleUserRole(username: string, level: USER_ROLE, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { username },
      data: { level },
      ...config,
    });
  }

  /** 管理员重置用户密码 */
  @Post("/{username}/reset/pwd")
  resetUserPassword(username: string, password: string, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { username },
      data: { password },
      ...config,
    });
  }

  /** 修改密码 */
  @Post("/change/pwd")
  changeUserPassword(data: IChangePassword, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      data,
      ...config,
    });
  }

  /** 修改昵称 */
  @Post("/update/nickname")
  updateUserNickname(data: IUserInfoUpdateDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      data,
      ...config,
    });
  }

  /** 测试状态码对应的错误提示 */
  @CaptureError(TestCaptureError)
  @Post("/testing/capture-error")
  testCaptureError(config?: IHttpRequestConfig) {
    return this.send({ captureError: false, ...config });
  }
}
