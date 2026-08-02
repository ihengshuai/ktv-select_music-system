import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 创建地区 */
export class CreateMusicRegionDTO {
  @ApiProperty({ required: true, description: "音乐地区" })
  @IsNotEmpty({ message: "地区名称不能为空" })
  @IsString({ message: "地区名称不能为空" })
  name: string;
}

/** 修改地区 */
export class UpdateMusicRegionDTO extends CreateMusicRegionDTO {}

/** 搜索地区 */
export class QueryMusicRegionDTO extends BaseQueryDTO {}
