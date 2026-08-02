import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { YON } from "@/consts";
import { BaseQueryDTO } from "@/dto/base-query.dto";

/**
 * 创建枚举值
 */
export class CreateEnumCodeDTO {
  @ApiProperty({ description: "枚举键称" })
  @IsString({ message: "枚举键称不能为空" })
  code: string;

  @ApiProperty({ description: "枚举值" })
  @IsString({ message: "枚举值不能为空" })
  value: string;

  @ApiProperty({ description: "枚举状态", enum: YON })
  @IsOptional()
  @IsEnum(YON, { message: "非法状态" })
  status: YON = YON.Y;

  @ApiProperty({ description: "枚举描述", required: false })
  @IsOptional()
  remark: string;
}

/**
 * 更新枚举值
 */
export class UpdateEnumCodeDTO {
  @ApiProperty({ description: "枚举值" })
  @IsString({ message: "枚举值不能为空" })
  value: string;

  @ApiProperty({ description: "枚举状态", enum: YON })
  @IsEnum(YON, { message: "非法状态" })
  status: YON;

  @ApiProperty({ description: "枚举描述" })
  @IsOptional()
  remark: string;
}

/** 查询枚举列表 */
export class QueryEnumCodeDTO extends BaseQueryDTO {
  @ApiProperty({ description: "枚举键称", required: false })
  @IsOptional()
  code: string;

  @ApiProperty({ description: "枚举状态", enum: YON, required: false })
  @IsOptional()
  @IsEnum(YON, { message: "非法状态" })
  status: YON;
}
