import { Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music_video")
export class MusicVideoEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
