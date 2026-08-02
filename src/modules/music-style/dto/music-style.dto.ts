import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 创建歌曲标签 */
export class CreateMusicStyleDTO {
  @ApiProperty({ required: true, description: "歌曲风格名称" })
  @IsNotEmpty({ message: "歌曲风格名称不能为空" })
  @IsString({ message: "歌曲风格名称不能为空" })
  name: string;
}

/** 更新歌曲风格 */
export class UpdateMusicStyleDTO extends CreateMusicStyleDTO {}

/** 获取歌曲风格列表 */
export class QueryMusicStyleDTO extends BaseQueryDTO {}
