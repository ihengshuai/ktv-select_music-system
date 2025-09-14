/**
 * 用户状态
 */
export enum USER_STATUS {
  /** 待激活 */
  PENDING,
  /** 已激活 */
  ACTIVE,
  /** 已禁用 */
  BANNED,
}

/** 用户角色 */
export enum USER_ROLE {
  /** 超级管理员 */
  SUPER,
  /** 管理员 */
  ADMIN,
  /** 开发者 */
  DEVELOPER,
  /** 普通用户 */
  USER,
}

/** 设置用户角色 meta KEY */
export const USER_ROLE_LABEL = "USER_ROLE";

/** 默认超级管理员 */
export const SUPER_USER = "root";
