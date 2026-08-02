import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

import { ORDER_OPERATION } from "@/consts/order.const";

/**
 * 查询订单操作记录
 */
export class QueryOrderOperationDTO {
  @ApiProperty({ description: "订单号", required: false })
  @IsOptional()
  orderId: string;
}

/** 创建订单操作记录 */
export class CreateOrderOperationDTO {
  /** 订单ID */
  orderId: string;
  /** 操作人类型 */
  operation: ORDER_OPERATION;
  /** 备注 */
  remark: string;
}
