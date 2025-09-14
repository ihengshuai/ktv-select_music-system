import { request } from "@/helper";
import { IHttpRequestConfig } from "@/typings/common/http";
import { IListQuery, IListResult } from "@/typings/common/table";
import { IUserListFilter } from "@/typings/models/user";

/**
 * 用户相关接口
 */
export const USER_URL = {
  /** 获取用户信息 */
  getUserDetail: `/mock/user/{userId}`,
  /** 获取用户列表 */
  getUsers: `/mock/users`,
};

/** 获取用户详情信息 */
export function fetchUserDetail(userId: any, config?: IHttpRequestConfig): Promise<IUserResponse> {
  return request.get(USER_URL.getUserDetail, {
    urlPath: { userId },
    retryCount: 2,
    ...config,
  });
}

/** 更新用户信息 */
export function fetchUpdateUser(userId: any, data: IUserResponse, config?: IHttpRequestConfig): Promise<IUserResponse> {
  return request.post(USER_URL.getUserDetail, {
    urlPath: { userId },
    data,
    // captureError: false,
    ...config,
  });
}

/** 获取用户列表 */
export function fetchUsers(
  params?: IListQuery<IUserListFilter>,
  config?: IHttpRequestConfig
): Promise<IListResult<IUser>> {
  return request.get(USER_URL.getUsers, {
    params,
    timeStamp: true,
    label: "请求用户列表",
    ...config,
  });
}
