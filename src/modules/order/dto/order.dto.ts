import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { nanoid } from "nanoid";

import { ORDER_PAY_STATUS, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/consts/order.const";
import { BaseDateTimeEntity } from "@/entities/base-datetime.entity";
import { formatDate } from "@/utils";

/**
 * 创建订单
 */
export class CreateOrderDTO extends BaseDateTimeEntity {
  @IsOptional()
  orderNo: string = formatDate(new Date(), "YYYYMMDDHHmmssSSS") + Math.floor(Math.random() * 1000000);

  @IsOptional()
  password: string = nanoid(8);

  @IsOptional()
  payStatus: ORDER_PAY_STATUS = ORDER_PAY_STATUS.PAID;

  @IsOptional()
  useStatus: ORDER_USE_STATUS = ORDER_USE_STATUS.NOT_USED;

  @IsOptional()
  validityStatus: ORDER_VALIDITY_STATUS = ORDER_VALIDITY_STATUS.NORMAL;

  @ApiProperty({ description: "操作密码" })
  @IsString({ message: "操作密码不能为空" })
  operatorPassword: string;

  @ApiProperty({ description: "时长" })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "时长必须是数字" })
  @Min(0.5, { message: "时长不能小于0.5h" })
  longTime: number;

  @IsOptional()
  createById: string;

  @IsOptional()
  updateById: string;
}

/**
 * 更新订单
 */
export class UpdateOrderDTO {
  longTime?: number;

  payStatus?: ORDER_PAY_STATUS = ORDER_PAY_STATUS.PAID;

  useStatus?: ORDER_USE_STATUS = ORDER_USE_STATUS.NOT_USED;

  validityStatus?: ORDER_VALIDITY_STATUS = ORDER_VALIDITY_STATUS.NORMAL;

  updateById?: string;
}

/**
 * 获取订单列表
 */
export class QueryOrderDTO {
  @ApiProperty({ description: "订单ID", required: false })
  @IsOptional()
  orderNo: string;

  @ApiProperty({ description: "创建时间", required: false })
  @IsOptional()
  createTime: string;

  @ApiProperty({ description: "创建者", required: false })
  @IsOptional()
  createById: string;

  @ApiProperty({ description: "订单状态", required: false })
  @IsOptional()
  validityStatus?: ORDER_VALIDITY_STATUS;

  @ApiProperty({ description: "使用状态", required: false })
  @IsOptional()
  useStatus?: ORDER_USE_STATUS;
}

/**
 * 续费
 */
export class ReChargeDTO {
  @ApiProperty({ description: "订单ID" })
  @IsString({ message: "订单ID不能为空" })
  orderNo: string;

  @ApiProperty({ description: "操作密码" })
  @IsString({ message: "操作密码不能为空" })
  operatorPassword: string;

  @ApiProperty({ description: "时长" })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "时长必须是数字" })
  @Min(0.5, { message: "时长不能小于0.5h" })
  longTime: number;
}

/**
 * 上机
 */
export class OnlineDTO {
  @ApiProperty({ description: "订单ID" })
  @IsString({ message: "订单ID不能为空" })
  orderNo: string;
}

/**
 * 下机
 */
export class OfflineDTO extends OnlineDTO {}

/**
 * 强制下线
 */
export class ForceOfflineDTO extends OnlineDTO {
  @ApiProperty({ description: "操作密码" })
  @IsString({ message: "操作密码不能为空" })
  operatorPassword: string;
}
