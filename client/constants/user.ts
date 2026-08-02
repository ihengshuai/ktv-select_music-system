import { setMetadata } from "@hengshuai/helper";

/** 爱好 */
export enum USER_HOBBY {
  football = 1,
  basketball,
  pingpong,
  running,
  swimming,
  tennis,
}

setMetadata(USER_HOBBY, {
  football: {
    alias: "hobbies.football",
  },
  basketball: {
    alias: "hobbies.basketball",
  },
  pingpong: {
    alias: "hobbies.pingpong",
  },
  running: {
    alias: "hobbies.running",
  },
  swimming: {
    alias: "hobbies.swimming",
  },
  tennis: {
    alias: "hobbies.tennis",
  },
});

/** 性别 */
export enum USER_SEX {
  male = "male",
  remale = "remale",
}

setMetadata(USER_SEX, {
  male: {
    alias: "common.male",
  },
  remale: {
    alias: "common.remale",
  },
});

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

setMetadata(USER_STATUS, {
  PENDING: {
    alias: "待激活",
  },
  ACTIVE: {
    alias: "已激活",
  },
  BANNED: {
    alias: "已禁用",
  },
});

/** 用户角色 */
export enum USER_ROLE {
  /** 超级管理员 */
  SUPER,
  /** 管理员 */
  ADMIN,
  /** 普通用户 */
  USER,
}

setMetadata(USER_ROLE, {
  SUPER: {
    alias: "超级管理员",
  },
  ADMIN: {
    alias: "管理员",
  },
  USER: {
    alias: "普通用户",
  },
});

/** 默认超级管理员账号 */
export const SUPER_USER = "root";
