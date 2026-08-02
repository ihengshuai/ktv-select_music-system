import { Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music_lyrics")
export class MusicLyricsEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
