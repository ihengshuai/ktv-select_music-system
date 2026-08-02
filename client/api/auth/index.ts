import { request } from "@/helper";
import { IHttpRequestConfig } from "@/typings/common/http";
import { IUserInfo } from "@/typings/models/user";

/** 相关地址 */
export const AUTH_API = {
  /** 请求用户信息 */
  auth: `/auth`,
  login: `/auth/login`,
  register: `/auth/register`,
  logout: `/auth/logout`,
  captcha: `/auth/captcha`,
  systemInit: `/auth/system-init`,
};

/** 验证用户身份 */
export function getUserInfo(config?: IHttpRequestConfig): Promise<IUserInfo> {
  return request.get(AUTH_API.auth, {
    ignoreCancelToken: true,
    captureError: false,
    ...config,
  });
}

/** 系统初始化 */
export function systemInitApi(data: any, config?: IHttpRequestConfig): Promise<boolean> {
  return request.post(AUTH_API.systemInit, {
    data,
    ignoreCancelToken: true,
    captureError: true,
    ...config,
  });
}

/** 登录api */
export function loginApi(data: any, config?: IHttpRequestConfig): Promise<boolean> {
  return request.post(AUTH_API.login, {
    data,
    ignoreCancelToken: true,
    captureError: true,
    ...config,
  });
}

/** 注册API */
export function registerApi(data: any, config?: IHttpRequestConfig): Promise<boolean> {
  return request.post(AUTH_API.register, {
    data,
    ignoreCancelToken: true,
    captureError: true,
    ...config,
  });
}

/** 登出api */
export function logoutApi(config?: IHttpRequestConfig): Promise<{ accessToken: string }> {
  return request.get(AUTH_API.logout, {
    ignoreCancelToken: true,
    captureError: true,
    ...config,
  });
}

/** 获取验证码 */
export function getCaptchaAPI(config?: IHttpRequestConfig): Promise<string> {
  return request.get(AUTH_API.captcha, {
    ignoreCancelToken: true,
    captureError: false,
    ...config,
  });
}
