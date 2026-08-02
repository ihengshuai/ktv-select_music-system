import { ApiProperty } from "@nestjs/swagger";

import { ORDER_PAY_STATUS, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/consts/order.const";
import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class OrderVO extends BaseDateTimeVO {
  @ApiProperty({ description: "订单ID" })
  orderNo: string;

  @ApiProperty({ description: "上机密码" })
  password: string;

  @ApiProperty({ description: "订单使用状态", enum: ORDER_USE_STATUS })
  useStatus: ORDER_USE_STATUS;

  @ApiProperty({ description: "订单支付状态", enum: ORDER_PAY_STATUS })
  payStatus: ORDER_PAY_STATUS;

  @ApiProperty({ description: "订单状态", enum: ORDER_VALIDITY_STATUS })
  validityStatus: ORDER_VALIDITY_STATUS;

  @ApiProperty({ description: "开始时间" })
  startTime: string;

  @ApiProperty({ description: "时长" })
  longTime: number;

  @ApiProperty({ description: "总金额" })
  amount: number;

  @ApiProperty({ description: "创建人ID" })
  createById: string;

  @ApiProperty({ description: "创建人" })
  createdAt: string;

  @ApiProperty({ description: "更新人ID" })
  updateById: string;

  @ApiProperty({ description: "更新人" })
  updateAt: string;
}
