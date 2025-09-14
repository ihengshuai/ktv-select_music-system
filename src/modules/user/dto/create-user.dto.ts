import { MinLength, MaxLength, IsString, IsOptional, IsNumber } from "class-validator";
import { nanoid } from "nanoid";

import { USER_ROLE, USER_STATUS } from "@/constants/user.constants";

export class CreateUserDTO {
  @IsOptional()
  uid: string = nanoid();

  @MinLength(4)
  @MaxLength(32)
  @IsString({ message: "账号不能为空" })
  username: string;

  @IsString({ message: "密码不能为空" })
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsOptional()
  nickname: string = `用户_${+new Date()}`;

  @MinLength(6)
  @MaxLength(32)
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsNumber()
  status = USER_STATUS.PENDING;

  @IsOptional()
  @IsNumber()
  level = USER_ROLE.USER;

  @IsOptional()
  @IsNumber()
  avatar: number;
}
