import { Entity } from "@/helper/decorator";

/**
 * 用户登录或注册
 */
@Entity()
export class UserLoginOrSignUpEntity {
  username: string;
  password: string;
  code: string;
}
