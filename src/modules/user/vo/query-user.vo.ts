import { ApiProperty } from "@nestjs/swagger";

import { USER_ROLE, USER_STATUS } from "@/consts";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

export class QueryUserVO extends BaseDateTimeEntity {
  @ApiProperty({ description: "ID" })
  id: string;

  @ApiProperty({ description: "用户唯一ID" })
  uid: string;

  @ApiProperty({ description: "账号" })
  username: string;

  @ApiProperty({ description: "昵称" })
  nickname: string; // 昵称

  @ApiProperty({ description: "邮箱" })
  email: string;

  @ApiProperty({ description: "状态", enum: USER_STATUS })
  status: number;

  @ApiProperty({ description: "角色", enum: USER_ROLE })
  level: number;

  @ApiProperty({ description: "头像资源ID" })
  avatar: string;

  @ApiProperty({ description: "头像地址" })
  avatarURL: string;

  constructor(data: Record<string, any>) {
    super();

    Object.assign(this, data);
  }
}
