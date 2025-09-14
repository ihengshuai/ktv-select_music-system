import { IFormRules } from "@/typings/common/form";
import { IUserLoginOrSignUpDTO } from "@/typings/models/user";

export function createUserLoginOrSignFormRule() {
  const rules: IFormRules<IUserLoginOrSignUpDTO> = {
    username: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请输入账号");
        return Promise.resolve();
      },
      trigger: "blur",
    },
    password: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请输入密码");
        return Promise.resolve();
      },
      trigger: "blur",
    },
    code: {
      async validator(rule, field) {
        if (!field.value) return Promise.reject("请输入验证码");
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };

  return rules;
}
