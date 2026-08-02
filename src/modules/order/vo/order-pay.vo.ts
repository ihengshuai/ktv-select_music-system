import { ApiProperty } from "@nestjs/swagger";

import { BaseDateTimeVO } from "@/vo/base-datetime.vo";

export class OrderPayVO extends BaseDateTimeVO {
  @ApiProperty({ description: "订单号" })
  orderId: string;

  @ApiProperty({ description: "单价/时" })
  price: number;

  @ApiProperty({ description: "金额" })
  amount: number;
}
