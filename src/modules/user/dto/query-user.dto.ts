import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import { USER_ROLE, USER_STATUS } from "@/consts";
import { BaseQueryDTO } from "@/dto/base-query.dto";

export class QueryUserDTO extends BaseQueryDTO {
  @ApiProperty({
    description: "用户角色",
    required: false,
    enum: USER_ROLE,
  })
  @IsOptional()
  level: USER_ROLE;

  @ApiProperty({
    description: "用户状态",
    required: false,
    enum: USER_STATUS,
  })
  @IsOptional()
  status: USER_STATUS;
}
