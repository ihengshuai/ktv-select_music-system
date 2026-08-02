import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { YON } from "@/consts";
import { MUSIC_STATUS } from "@/consts/music.const";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music")
export class MusicEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "歌曲id" })
  uid: string;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "歌曲名" })
  title: string;

  @Column({ type: "varchar", length: 50, nullable: false, comment: "音频文件" })
  audio: string;

  @Column({ type: "varchar", length: 50, nullable: true, comment: "歌词" })
  lyrics: string;

  @Column({ type: "varchar", length: 50, nullable: true, comment: "视频" })
  video: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "歌曲备注" })
  remark: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "歌手" })
  singer: string;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "歌曲语言" })
  language: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "歌曲风格" })
  style: string;

  @Column({ type: "varchar", length: 50, nullable: false, comment: "歌曲地区" })
  region: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "歌曲标签" })
  tag: string;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "testing" })
  testing: string;

  @Column({ type: "bigint", nullable: true, default: 0, comment: "歌曲热度" })
  heat: number;

  @Column({ type: "enum", nullable: true, enum: YON, default: YON.N, comment: "是否推荐" })
  recommend: YON;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "创建人" })
  createBy: string;

  @Column({
    type: "enum",
    nullable: true,
    enum: MUSIC_STATUS,
    default: MUSIC_STATUS.ENABLED,
    comment: "歌曲状态",
  })
  status: MUSIC_STATUS;
}
