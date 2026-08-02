import { ApiProperty } from "@nestjs/swagger";

import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class MusicRegionVO extends BaseDateTimeVO {
  @ApiProperty({ description: "歌曲地区id" })
  id: number;

  @ApiProperty({ description: "歌曲地区名称" })
  name: string;
}
