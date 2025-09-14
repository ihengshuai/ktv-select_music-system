import { IsString } from "class-validator";

export class UserLoginDTO {
  @IsString({ message: "账号不能为空" })
  username: string;

  @IsString({ message: "密码不能为空" })
  password: string;

  @IsString({ message: "验证码不能为空" })
  code: string;
}
