import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { YON } from "@/consts";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

@Entity("t_enum_code")
export class EnumCodeEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true, nullable: false, comment: "枚举键称" })
  code: string;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "枚举值" })
  value: string;

  @Column({ type: "enum", enum: YON, default: YON.Y, nullable: false, comment: "状态" })
  status: YON = YON.Y;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "枚举描述" })
  remark: string;
}
