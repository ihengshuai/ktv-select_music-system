import { ApiProperty } from "@nestjs/swagger";

import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class MusicSingerVO extends BaseDateTimeVO {
  @ApiProperty({ description: "歌手id" })
  id: number;

  @ApiProperty({ description: "歌手名称" })
  name: string;
}
