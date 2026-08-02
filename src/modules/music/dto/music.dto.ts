import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { nanoid } from "nanoid";

import { YON } from "@/consts";
import { MUSIC_STATUS } from "@/consts/music.const";
import { BaseQueryDTO } from "@/dto/base-query.dto";

/** 新增歌曲 */
export class CreateMusicDTO {
  @IsOptional()
  uid: string = nanoid();

  /**
   * 标题
   */
  @ApiProperty({ description: "歌曲标题", required: true })
  @MinLength(1, { message: "歌曲标题长度要求1-32个字符" })
  @MaxLength(32, { message: "歌曲标题长度要求1-32个字符" })
  @IsString({ message: "歌曲标题不能为空" })
  title: string;

  /**
   * 歌手
   */
  @ApiProperty({ description: "歌曲歌手", required: true })
  @IsString({ message: "歌手不能为空" })
  singer: string;

  /**
   * 音频文件
   */

  @ApiProperty({ description: "音频文件", required: true })
  @IsString({ message: "音频文件不能为空" })
  audio: string;

  /**
   * 歌词
   */
  @ApiProperty({ description: "歌曲歌词", required: false })
  @IsOptional()
  @IsString()
  lyrics: string;

  /**
   * 歌词
   */
  @ApiProperty({ description: "歌曲视频", required: false })
  @IsOptional()
  @IsString()
  video: string;

  /**
   * 备注
   */
  @ApiProperty({ description: "歌曲备注", required: false })
  @IsOptional()
  @MaxLength(255, { message: "歌曲备注长度要求0-255个字符" })
  @IsString()
  remark: string;

  /**
   * 语言
   */
  @ApiProperty({ description: "歌曲语言", required: true })
  @IsString({ message: "歌曲语言不能为空" })
  language: string;

  /**
   * 地区
   */
  @ApiProperty({ description: "歌曲地区", required: true })
  @IsString({ message: "歌曲地区不能为空" })
  region: string;

  /**
   * 标签
   */
  @ApiProperty({ description: "歌曲标签", required: false })
  @IsOptional()
  @IsString()
  tag: string;

  /**
   * 风格
   */
  @ApiProperty({ description: "歌曲风格", required: false })
  @IsOptional()
  @IsString()
  style: string;

  @IsOptional()
  @IsString()
  createBy: string;

  @ApiProperty({ description: "歌曲状态", required: false, enum: MUSIC_STATUS })
  @IsOptional()
  @IsEnum(MUSIC_STATUS, { message: "歌曲状态错误" })
  status: MUSIC_STATUS = MUSIC_STATUS.ENABLED;

  @ApiProperty({ description: "热度", required: false })
  @IsOptional()
  @IsInt()
  heat: number;

  @ApiProperty({ description: "是否推荐", required: false, enum: YON })
  @IsOptional()
  @IsEnum(YON, { message: "歌曲推荐值错误" })
  recommend: YON = YON.N;
}

/**
 * 歌曲列表搜索
 */

export class MusicListQueryDTO extends BaseQueryDTO {
  @ApiProperty({ description: "歌曲标题", required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: "歌手", required: false })
  @IsOptional()
  @IsString()
  singer: string;

  @ApiProperty({ description: "歌曲语言", required: false })
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({ description: "歌曲地区", required: false })
  @IsOptional()
  @IsString()
  region: string;

  @ApiProperty({ description: "歌曲风格", required: false })
  @IsOptional()
  @IsString()
  style: string;

  @ApiProperty({ description: "歌曲标签", required: false })
  @IsOptional()
  @IsString()
  tag: string;

  @ApiProperty({ description: "歌曲状态", required: false, enum: MUSIC_STATUS })
  @IsOptional()
  @IsEnum(MUSIC_STATUS, { message: "歌曲状态错误" })
  status: MUSIC_STATUS;

  @ApiProperty({ description: "是否推荐", required: false, enum: YON })
  @IsOptional()
  @IsEnum(YON, { message: "歌曲推荐值错误" })
  recommend: YON;
}

/**
 * 更新歌曲
 */
export class UpdateMusicDTO {
  /**
   * 标题
   */
  @ApiProperty({ description: "歌曲标题", required: true })
  @MinLength(1, { message: "歌曲标题长度要求1-32个字符" })
  @MaxLength(32, { message: "歌曲标题长度要求1-32个字符" })
  @IsString({ message: "歌曲标题不能为空" })
  title: string;

  /**
   * 歌手
   */
  @ApiProperty({ description: "歌曲歌手", required: true })
  @IsString({ message: "歌手不能为空" })
  singer: string;

  /**
   * 音频文件
   */

  @ApiProperty({ description: "音频文件", required: true })
  @IsString({ message: "音频文件不能为空" })
  audio: string;

  /**
   * 歌词
   */
  @ApiProperty({ description: "歌曲歌词", required: false })
  @IsOptional()
  @IsString()
  lyrics: string;

  /**
   * 歌词
   */
  @ApiProperty({ description: "歌曲视频", required: false })
  @IsOptional()
  @IsString()
  video: string;

  /**
   * 备注
   */
  @ApiProperty({ description: "歌曲备注", required: false })
  @IsOptional()
  @MaxLength(255, { message: "歌曲备注长度要求0-255个字符" })
  @IsString()
  remark: string;

  /**
   * 语言
   */
  @ApiProperty({ description: "歌曲语言", required: true })
  @IsString({ message: "歌曲语言不能为空" })
  language: string;

  /**
   * 地区
   */
  @ApiProperty({ description: "歌曲地区", required: true })
  @IsString({ message: "歌曲地区不能为空" })
  region: string;

  /**
   * 标签
   */
  @ApiProperty({ description: "歌曲标签", required: false })
  @IsOptional()
  @IsString()
  tag: string;

  /**
   * 风格
   */
  @ApiProperty({ description: "歌曲风格", required: false })
  @IsOptional()
  @IsString()
  style: string;

  @IsOptional()
  @ApiProperty({ description: "歌曲状态", required: false, enum: MUSIC_STATUS })
  @IsEnum(MUSIC_STATUS, { message: "歌曲状态错误" })
  status: MUSIC_STATUS;

  @ApiProperty({ description: "热度", required: false })
  @IsOptional()
  @IsInt()
  heat: number;

  @ApiProperty({ description: "是否推荐", required: false, enum: YON })
  @IsOptional()
  @IsEnum(YON, { message: "歌曲推荐值错误" })
  recommend: YON;
}
