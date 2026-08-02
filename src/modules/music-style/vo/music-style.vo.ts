import { ApiProperty } from "@nestjs/swagger";

import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class MusicStyleVO extends BaseDateTimeVO {
  @ApiProperty({ description: "歌曲风格id" })
  id: number;

  @ApiProperty({ description: "歌曲风格名称" })
  name: string;
}
