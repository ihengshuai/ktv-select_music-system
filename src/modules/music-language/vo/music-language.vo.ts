import { ApiProperty } from "@nestjs/swagger";

import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class MusicLanguageVO extends BaseDateTimeVO {
  @ApiProperty({ description: "歌曲语言id" })
  id: number;

  @ApiProperty({ description: "歌曲语言名称" })
  name: string;
}
