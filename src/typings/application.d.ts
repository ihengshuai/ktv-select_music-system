// eslint-disable-next-line no-unused-vars
import { USER_ROLE } from "@/constants";

export interface IToken {
  /** 数据库id */
  id: number;
  /** 唯一ID */
  uid: string;
  /** 用户名 */
  username: string;
  /** 身份 */
  level: USER_ROLE;
  /** 状态 */
  status: USER_STATUS;
  /** 过期时间 */
  expire: number;
}
