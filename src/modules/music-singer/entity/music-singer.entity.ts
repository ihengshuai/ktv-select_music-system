import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music_singer")
export class MusicSingerEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "歌手名称" })
  name: string;
}
