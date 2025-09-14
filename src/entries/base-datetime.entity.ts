import dayjs from "dayjs";
import { Column, UpdateDateColumn } from "typeorm";

import { DateFormat } from "@/constants";

export class BaseDateTimeEntity {
  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    transformer: { from: v => dayjs(v).format(DateFormat.DATE_FULLTIME), to: v => v },
  })
  createTime: Date;

  @UpdateDateColumn({ transformer: { from: v => dayjs(v).format(DateFormat.DATE_FULLTIME), to: v => v } })
  updateTime: Date;
}
