// @ts-ignore
import md5 from "md5";

import { IFormModel } from "@/typings/common/form";
import { IUserLoginOrSignUpDTO } from "@/typings/models/user";

/** 用户登录/注册模型 */
export function createUserAuthModel() {
  const model: IFormModel<IUserLoginOrSignUpDTO> = {
    username: {
      value: null,
    },
    password: {
      value: null,
      transform: v => (v && md5(v)) || null,
    },
    code: {
      value: null,
      transform: v => (v && md5(v.toLowerCase())) || null,
    },
  };

  return model;
}
