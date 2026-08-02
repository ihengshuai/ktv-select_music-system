import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_music_style")
export class MusicStyleEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "风格名称" })
  name: string;
}
