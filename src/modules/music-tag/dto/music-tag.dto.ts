import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 创建歌曲标签 */
export class CreateMusicTagDTO {
  @ApiProperty({ required: true, description: "歌曲标签名称" })
  @IsNotEmpty({ message: "歌曲标签名称不能为空" })
  @IsString({ message: "歌曲标签名称不能为空" })
  name: string;
}

export class UpdateMusicTagDTO extends CreateMusicTagDTO {}

/** 标签搜索 */
export class QueryMusicTagDTO extends BaseQueryDTO {}
