import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { USER_ROLE, USER_STATUS } from "@/consts";

/** 改变用户角色 */
export class ChangeUserRoleDTO {
  @ApiProperty({
    description: "用户角色",
    enum: USER_ROLE,
    required: true,
  })
  @IsEnum(USER_ROLE)
  level: USER_ROLE;
}

/** 改变用户状态 */
export class ChangeUserStatusDTO {
  @ApiProperty({
    description: "用户状态",
    enum: USER_STATUS,
    required: true,
  })
  @IsEnum(USER_STATUS, { message: "Invalid status" })
  status: USER_STATUS;
}
