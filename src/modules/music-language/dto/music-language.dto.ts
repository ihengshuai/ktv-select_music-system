import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 创建语言 */
export class CreateMusicLanguageDTO {
  @ApiProperty({ required: true, description: "音乐语言" })
  @IsNotEmpty({ message: "语言名称不能为空" })
  @IsString({ message: "语言名称不能为空" })
  name: string;
}

/** 修改语言 */
export class UpdateMusicLanguageDTO extends CreateMusicLanguageDTO {}

/** 查询语言 */
export class QueryMusicLanguageDTO extends BaseQueryDTO {}
