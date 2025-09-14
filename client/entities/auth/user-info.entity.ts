import { USER_ROLE, USER_STATUS } from "@/constants/user";
import { Entity, FromJSON } from "@/helper/decorator";

/** 用户信息实体类 */
@Entity()
export class UserInfoEntity {
  /** 唯一id */
  uid: string;

  /** 账号 */
  username: string;

  /** 昵称 */
  @FromJSON<UserInfoEntity, "nickname">(v => "【用户昵称】:" + v)
  nickname: string;
  /** 等级 */
  level: USER_ROLE;
  /** 状态 */
  status: USER_STATUS;
  /** 头像 */
  avatar: number;
  /** 头像URL */
  avatarURL: string;
}

/** 更新用户信息实体类 */
@Entity()
export class UserInfoUpdateEntity {
  nickname?: string;
  avatar?: number;
}

/** 更新密码实体类 */
@Entity()
export class UserUpdatePasswordEntity {
  oldPassword: string;
  newPassword: string;
}
