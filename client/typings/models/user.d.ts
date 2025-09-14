import { USER_ROLE, USER_STATUS } from "@/constants/user";

/**
 * 用户登录或注册
 */
export interface IUserLoginOrSignUpDTO {
  username: string;
  password: string;
  code: string;
}

/**
 * 用户搜索
 */
export interface IUserListFilter extends ICommonQuery {}

/** 用户信息 */
export interface IUserInfo {
  uid: string;
  username: string;
  nickname: string;
  level: USER_ROLE;
  status: USER_STATUS;
  avatar: number;
  avatarURL: string;
}

export interface IUserInfoUpdateDTO {
  nickname?: string;
  avatar?: number;
}

/** 修改密码字段 */
export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}
