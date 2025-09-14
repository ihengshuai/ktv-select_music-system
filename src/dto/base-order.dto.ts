import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { Order } from "@/constants";

export class OrderDTO {
  @IsOptional()
  @IsString()
  @Transform(v => v.value || "createTime")
  orderBy: string = "createTime";

  @IsOptional()
  @IsString()
  @Transform(v => v.value?.toUpperCase?.() || Order.DESC)
  order: Order = Order.DESC; // 默认时间降序
}
