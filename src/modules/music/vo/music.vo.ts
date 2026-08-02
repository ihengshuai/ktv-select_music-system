import { ApiProperty } from "@nestjs/swagger";

import { MUSIC_STATUS } from "@/consts/music.const";
import { MusicStyleVO } from "@/modules/music-style/vo/music-style.vo";
import { MusicTagVO } from "@/modules/music-tag/vo/music-tag.vo";
import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class MusicVO extends BaseDateTimeVO {
  @ApiProperty({ description: "歌曲id" })
  uid: string;

  @ApiProperty({ description: "歌曲标题" })
  title: string;

  @ApiProperty({ description: "歌曲音频" })
  audio: string;

  @ApiProperty({ required: false, description: "歌曲视频" })
  video: string;

  @ApiProperty({ required: false, description: "歌曲歌词" })
  lyrics: string;

  @ApiProperty({ required: false, description: "歌曲备注" })
  remark: string;

  @ApiProperty({ description: "歌手" })
  singer: string;

  @ApiProperty({ description: "创建者" })
  createBy: string;

  @ApiProperty({ description: "创建者Id" })
  createById: string;

  @ApiProperty({ description: "歌曲语言" })
  language: string;

  @ApiProperty({ required: false, isArray: true, type: MusicStyleVO, description: "歌曲风格" })
  style: MusicStyleVO[];

  @ApiProperty({ description: "歌曲地区" })
  region: string;

  @ApiProperty({ required: false, isArray: true, type: MusicTagVO, description: "歌曲标签" })
  tag: MusicTagVO[];

  @ApiProperty({ description: "歌曲热度" })
  heat: number;

  @ApiProperty({ description: "歌曲状态", enum: MUSIC_STATUS, default: MUSIC_STATUS.ENABLED })
  status: MUSIC_STATUS;
}
