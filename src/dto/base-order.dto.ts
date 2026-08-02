import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { ORDER } from "@/consts";

export class OrderDTO {
  @ApiProperty({ description: "排序字段", required: false, default: "createTime" })
  @IsOptional()
  @IsString()
  @Transform(v => v.value || "createTime")
  orderBy: string = "createTime";

  @ApiProperty({ description: "排序", required: false, enum: ORDER, default: ORDER.DESC })
  @IsOptional()
  @IsString()
  @Transform(v => v.value?.toUpperCase?.() || ORDER.DESC)
  order: ORDER = ORDER.DESC; // 默认时间降序
}
