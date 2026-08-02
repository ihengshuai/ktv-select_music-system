import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { DATE_FORMAT } from "@/consts";
import { ORDER_PAY_STATUS, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/consts/order.const";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";
import { formatDate } from "@/utils";

@Entity("t_order")
export class OrderEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "订单号" })
  orderNo: string;

  @Column({ type: "varchar", length: 255, nullable: false, comment: "上机密码" })
  password: string;

  @Column({ type: "enum", enum: ORDER_PAY_STATUS, nullable: false, comment: "支付状态" })
  payStatus: ORDER_PAY_STATUS;

  @Column({
    type: "enum",
    enum: ORDER_USE_STATUS,
    default: ORDER_USE_STATUS.NOT_USED,
    nullable: false,
    comment: "使用状态",
  })
  useStatus: ORDER_USE_STATUS;

  @Column({ type: "enum", enum: ORDER_VALIDITY_STATUS, nullable: false, comment: "订单有效期状态" })
  validityStatus: ORDER_VALIDITY_STATUS;

  @Column({
    type: "timestamp",
    transformer: {
      from: v => {
        return v ? formatDate(v, DATE_FORMAT.DATE_FULLTIME) : null;
      },
      to: v => {
        return v ? formatDate(v, DATE_FORMAT.DATE_FULLTIME) : null;
      },
    },
    nullable: true,
    comment: "开始上机时间",
  })
  startTime: Date;

  @Column({ type: "float", nullable: false, comment: "时长" })
  longTime: number;

  @Column({ type: "varchar", nullable: false, comment: "订单创建者" })
  createById: string;

  @Column({ type: "varchar", nullable: false, comment: "订单更新者" })
  updateById: string;
}
