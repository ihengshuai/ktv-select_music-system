import { YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { IBaseDateTime, IBaseQuery } from "@/typings/common/common";

/** 创建歌曲 */
export interface IMusicCreateDTO {
  title: string;
  /** 歌手ID */
  singer: string;
  /** 音频文件ID */
  audio: string;
  /** 歌词文件ID */
  lyrics?: string;
  /** MV视频文件ID */
  video?: string;
  /** 语种ID */
  language: string;
  /** 地区ID */
  region: string;
  /** 风格ID */
  style?: string;
  /** 标签ID */
  tag?: string;
  /** 热度 */
  heat?: number;
  status?: MUSIC_STATUS;
  /** 是否推荐 */
  recommend?: YoN;
  remark?: string;
}

/** 更新歌曲 */
export interface IMusicUpdateDTO extends IMusicCreateDTO {}

export interface IQueryMusicDTO extends IBaseQuery {
  title?: string;
  singer?: string;
  style?: string;
  tag?: string;
  region?: string;
  language?: string;
  status?: MUSIC_STATUS;
  recommend?: YoN;
}

/** 歌曲 */
export interface IMusicVO extends IBaseDateTime {
  uid: string;
  title: string;
  singer: string;
  singerName: string;
  audio: string;
  audioUrl: string;
  video?: string;
  lyrics?: string;

  language: string;
  languageName: string;
  region: string;
  regionName: string;
  style: IMusicAttributeVO[];
  tag: IMusicAttributeVO[];

  heat: number;
  recommend: YoN;

  status: MUSIC_STATUS;

  remark?: string;

  /** 创建者 */
  createBy: string;
  createById: string;
}

export interface IMusicAttributeVO {
  id: string;
  name: string;
}
