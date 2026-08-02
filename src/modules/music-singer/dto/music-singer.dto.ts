import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 创建歌手 */
export class CreateMusicSingerDTO {
  @ApiProperty({ required: true, description: "歌手名称" })
  @IsNotEmpty({ message: "歌手名称不能为空" })
  @IsString({ message: "歌手名称不能为空" })
  name: string;
}

/** 修改歌手 */
export class UpdateMusicSingerDTO extends CreateMusicSingerDTO {}

/** 查询歌手 */
export class QueryMusicSingerDTO extends BaseQueryDTO {}
