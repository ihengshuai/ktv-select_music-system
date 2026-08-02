import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { ORDER_PAY_TYPE } from "@/consts/order.const";

/**
 * 查询订单支付列表
 */
export class QueryOrderPayDTO {
  @ApiProperty({ description: "订单号", required: false })
  @IsOptional()
  orderId?: string;

  @ApiProperty({ description: "收支类型", required: false })
  @IsEnum(ORDER_PAY_TYPE, { message: "错误的收支类型" })
  @IsOptional()
  type?: ORDER_PAY_TYPE;
}

/** 创建订单付费记录 */
export class CreateOrderPayDTO {
  /** 订单ID */
  orderId: string;
  /** 单价 */
  price: number;
  /** 时长 */
  longTime: number;
  /** 金额 */
  amount: number;
  /** 支出/收入 */
  type?: ORDER_PAY_TYPE;
  remark?: string;
}
