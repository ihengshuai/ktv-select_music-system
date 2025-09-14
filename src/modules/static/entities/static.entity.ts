import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { FileType } from "@/constants";
import { BaseDateTimeEntity } from "@/entries/base-datetime.entity";
import { generateStaticURL } from "@/utils";

@Entity("t_static")
export class StaticEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: FileType, nullable: false })
  type: FileType;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "上传者" })
  uid: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    transformer: { to: value => value, from: value => generateStaticURL(value) },
  })
  url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  remark: string;
}
