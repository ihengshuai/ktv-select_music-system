import { ApiProperty } from "@nestjs/swagger";
import { Column, UpdateDateColumn } from "typeorm";

import { DATE_FORMAT } from "@/consts";
import { formatDate } from "@/utils";

export class BaseDateTimeEntity {
  @ApiProperty({
    description: "创建时间",
    format: DATE_FORMAT.DATE_FULLTIME,
  })
  @Column({
    type: "timestamp",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
    transformer: {
      from: v => {
        return formatDate(v, DATE_FORMAT.DATE_FULLTIME);
      },
      to: v => {
        return formatDate(v, DATE_FORMAT.DATE_FULLTIME);
      },
    },
  })
  createTime: Date;

  @ApiProperty({
    description: "更新时间",
    format: DATE_FORMAT.DATE_FULLTIME,
  })
  @UpdateDateColumn({
    transformer: {
      from: v => {
        return formatDate(v, DATE_FORMAT.DATE_FULLTIME);
      },
      to: v => {
        return formatDate(v, DATE_FORMAT.DATE_FULLTIME);
      },
    },
  })
  updateTime: Date;
}
