import { ApiProperty } from "@nestjs/swagger";

import { ORDER_OPERATION } from "@/consts/order.const";
import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class OrderOperationVO extends BaseDateTimeVO {
  @ApiProperty({ description: "订单ID" })
  orderId: string;

  @ApiProperty({ description: "操作类型", enum: ORDER_OPERATION })
  operation: ORDER_OPERATION;

  @ApiProperty({ description: "备注" })
  remark: string;
}
