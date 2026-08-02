import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { ORDER_OPERATION } from "@/consts/order.const";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";

/**
 * 记录所有订单操作记录
 */
@Entity("t_order_operation")
export class OrderOperationEntity extends BaseDateTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, comment: "订单ID" })
  orderId: string;

  @Column({ type: "enum", enum: ORDER_OPERATION, nullable: false, comment: "操作类型" })
  operation: ORDER_OPERATION;

  @Column({ type: "varchar", nullable: true, comment: "备注" })
  remark: string;
}
