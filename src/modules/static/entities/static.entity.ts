import { instanceToPlain } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { FILE_LOCATION, FILE_TYPE } from "@/consts";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";
import { generateStaticURL } from "@/utils";

@Entity("t_static")
export class StaticEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: FILE_TYPE, nullable: false, comment: "文件类型" })
  type: FILE_TYPE;

  @Column({ type: "enum", enum: FILE_LOCATION, nullable: false, comment: "文件存储位置" })
  location: FILE_LOCATION;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "上传者" })
  uid: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    transformer: { to: value => value, from: value => value },
  })
  url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  remark: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  fileName: string;

  toJSON() {
    const json = instanceToPlain(this) as StaticEntity;

    json.url = generateStaticURL(json.url, json.location);

    return json;
  }
}
