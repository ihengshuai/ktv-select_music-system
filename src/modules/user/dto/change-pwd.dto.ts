import { ApiProperty } from "@nestjs/swagger";
import { MinLength, IsString } from "class-validator";

export class ChangePwdDTO {
  @ApiProperty({ description: "旧密码", minLength: 6 })
  @IsString({ message: "旧密码不能为空" })
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ description: "新密码", minLength: 6 })
  @IsString({ message: "新密码不能为空" })
  @MinLength(6)
  newPassword: string;
}
