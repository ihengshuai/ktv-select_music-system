import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { ORDER_PAY_TYPE } from "@/consts/order.const";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

/**
 * 记录所有订单所有支付记录
 */
@Entity("t_order_pay")
export class OrderPayEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, comment: "订单ID" })
  orderId: string;

  @Column({ type: "float", nullable: false, comment: "单价/时" })
  price: number;

  @Column({ type: "float", nullable: false, comment: "时长" })
  longTime: number;

  @Column({ type: "float", nullable: false, comment: "金额" })
  amount: number;

  @Column({
    type: "enum",
    default: ORDER_PAY_TYPE.IN,
    enum: ORDER_PAY_TYPE,
    nullable: false,
    comment: "支付类型(支出/收入)",
  })
  type: ORDER_PAY_TYPE;

  @Column({ type: "varchar", nullable: true, comment: "备注" })
  remark: string;
}
