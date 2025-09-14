import { MinLength, IsString } from "class-validator";

export class ChangePwdDTO {
  @IsString({ message: "旧密码不能为空" })
  @MinLength(6)
  oldPassword: string;

  @IsString({ message: "新密码不能为空" })
  @MinLength(6)
  newPassword: string;
}
