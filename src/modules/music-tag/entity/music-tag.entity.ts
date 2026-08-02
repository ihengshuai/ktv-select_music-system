import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music_tag")
export class MusicTagEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "歌曲标签名称" })
  name: string;
}
