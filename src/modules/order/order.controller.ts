import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Transactional } from "typeorm-transactional";

import { Role, Token } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { RequiredPipe } from "@/common/pipe/required.pipe";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE, YON } from "@/consts";
import { ENUM_CODE } from "@/consts/enum-code.const";
import { ORDER_OPERATION, ORDER_PAY_TYPE, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/consts/order.const";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import type { IToken } from "@/typings/application";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { CreateOrderDTO, ForceOfflineDTO, QueryOrderDTO, ReChargeDTO, UpdateOrderDTO } from "./dto/order.dto";
import { OrderService } from "./order.service";
import { EnumCodeService } from "../enum-code/enum-code.service";
import { UserService } from "../user/user.service";
import { CreateOrderOperationDTO, QueryOrderOperationDTO } from "./dto/order-operation.dto";
import { CreateOrderPayDTO, QueryOrderPayDTO } from "./dto/order-pay.dto";
import { OrderOperationVO } from "./vo/order-operation.vo";
import { OrderPayVO } from "./vo/order-pay.vo";
import { OrderVO } from "./vo/order.vo";

@ApiTags("订单管理")
@Controller("order")
@UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
@Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly enumCodeService: EnumCodeService,
    private readonly userService: UserService
  ) {}

  /**
   * 获取订单列表
   */
  @ApiOperation({ summary: "订单列表" })
  @ApiListResponse(OrderVO)
  @Get()
  async getOrderList(@Query() query: QueryOrderDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.orderService.getOrderList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 获取订单详情
   */
  @ApiOperation({ summary: "订单详情" })
  @ApiModelResponse(OrderVO)
  @Get("detail/:orderNo")
  async getOrderDetail(@Param("orderNo") orderNo: string) {
    const res = await this.orderService.getOrderDetail(orderNo);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 下单
   */
  @Transactional()
  @ApiOperation({ summary: "下单" })
  @ApiModelResponse(OrderVO)
  @Post()
  async order(
    @Token() token: IToken,
    @Body() data: CreateOrderDTO,
    @Body("operatorPassword", new RequiredPipe("操作密码错误")) operatorPassword: string
  ) {
    const isValidatePwd = (await this.userService.findUser(token.username)).validatePassword(operatorPassword);

    if (!isValidatePwd) throw new BadRequestException("操作密码错误");

    // 1. 创建订单
    const payload: CreateOrderDTO = {
      ...data,
      createById: token.uid,
      updateById: token.uid,
    };

    const orderResult = await this.orderService.createOrder(payload);

    // 2. 创建付费记录
    const enumCodeResult = await this.enumCodeService.getEnumCode(ENUM_CODE.ONLINE_PER_HOUR_PRICE);
    if (enumCodeResult.status === YON.N) throw new BadRequestException("系统单价状态错误(请先配置)");

    const payPayload: CreateOrderPayDTO = {
      orderId: orderResult.orderNo,
      price: enumCodeResult.value as unknown as number,
      longTime: data.longTime,
      amount: data.longTime * Number(enumCodeResult.value),
      type: ORDER_PAY_TYPE.IN,
      remark: "创建订单",
    };
    await this.orderService.createOrderPay(payPayload);

    // 3. 创建操作记录
    const operationPayload: CreateOrderOperationDTO = {
      orderId: orderResult.orderNo,
      operation: ORDER_OPERATION.ORDER,
      remark: "创建订单",
    };
    await this.orderService.createOrderOperation(operationPayload);

    return BaseModelResponseVO.success(orderResult);
  }

  /**
   * 续费
   */
  @Transactional()
  @ApiOperation({ summary: "续费" })
  @ApiModelResponse(OrderVO)
  @Post("renew")
  async renew(
    @Token() token: IToken,
    @Body() payload: ReChargeDTO,
    @Body("operatorPassword", new RequiredPipe("操作密码错误")) operatorPassword: string
  ) {
    const isValidatePwd = (await this.userService.findUser(token.username)).validatePassword(operatorPassword);
    if (!isValidatePwd) throw new BadRequestException("操作密码错误");

    const hasOrder = await this.orderService.isOrderExist(payload.orderNo);
    // 排除订单不存在
    if (!hasOrder) throw new BadRequestException("订单不存在");
    // 排除订单已到期
    if (hasOrder.validityStatus === ORDER_VALIDITY_STATUS.EXPIRED) throw new BadRequestException("订单已过期无法续费");

    // 1. 修改订单时长
    const orderPayload: UpdateOrderDTO = {
      longTime: Number(payload.longTime) + Number(hasOrder.longTime),
      updateById: token.uid,
    };
    const orderResult = await this.orderService.updateOrder(payload.orderNo, orderPayload);
    if (!orderResult) throw new BadRequestException("订单续费失败");

    // 2. 创建付费记录
    const enumCodeResult = await this.enumCodeService.getEnumCode(ENUM_CODE.ONLINE_PER_HOUR_PRICE);
    if (enumCodeResult.status === YON.N) throw new BadRequestException("系统单价状态错误(请先配置)");

    const payPayload: CreateOrderPayDTO = {
      orderId: payload.orderNo,
      price: enumCodeResult.value as unknown as number,
      longTime: payload.longTime,
      amount: payload.longTime * Number(enumCodeResult.value),
      type: ORDER_PAY_TYPE.IN,
      remark: "订单续费",
    };
    await this.orderService.createOrderPay(payPayload);

    // 3.创建订单操作记录
    const operationPayload: CreateOrderOperationDTO = {
      orderId: payload.orderNo,
      operation: ORDER_OPERATION.RENEW,
      remark: "订单续费",
    };
    await this.orderService.createOrderOperation(operationPayload);

    return true;
  }

  /**
   * 强制下机
   */
  @Transactional()
  @ApiOperation({ summary: "强制下机" })
  @ApiModelResponse(OrderVO)
  @Post("force-offline")
  async forceOffline(
    @Token() token: IToken,
    @Body() payload: ForceOfflineDTO,
    @Body("operatorPassword", new RequiredPipe("操作密码错误")) operatorPassword: string
  ) {
    const isValidatePwd = (await this.userService.findUser(token.username)).validatePassword(operatorPassword);
    if (!isValidatePwd) throw new BadRequestException("操作密码错误");

    const hasOrder = await this.orderService.isOrderExist(payload.orderNo);
    // 排除订单不存在
    if (!hasOrder) throw new BadRequestException("订单不存在");
    // 排除订单已到期
    if (hasOrder.validityStatus === ORDER_VALIDITY_STATUS.EXPIRED) throw new BadRequestException("订单已过期无法操作");

    const orderPayload: UpdateOrderDTO = {
      validityStatus: ORDER_VALIDITY_STATUS.EXPIRED,
      updateById: token.uid,
    };
    const orderResult = await this.orderService.updateOrder(payload.orderNo, orderPayload);
    if (!orderResult) throw new BadRequestException("下机失败");

    const allMinHourTotal = Math.floor(+new Date() / 1000 / 60 / 30);
    const allPayRecord = await this.orderService.getOrderPayList({ orderId: payload.orderNo }, { page: 1, size: 100 });
    const payTotal = allPayRecord.items.reduce((acc, cur) => acc + cur.amount, 0);
    let remainMinute = 0;
    let remainMoney = 0;
    if (hasOrder.useStatus === ORDER_USE_STATUS.NOT_USED) {
      remainMinute = hasOrder.longTime;
      remainMoney = payTotal;
    } else {
      remainMinute = (+new Date() - +new Date(hasOrder.startTime)) / 1000 / 60;
      remainMinute = Math.floor(remainMinute / 30);
      remainMoney = payTotal * (remainMinute / allMinHourTotal);
    }

    const operationPayload: CreateOrderOperationDTO = {
      orderId: payload.orderNo,
      operation: ORDER_OPERATION.FORCE_OFFLINE,
      remark: `强制下机（退款：${remainMoney}元）`,
    };
    await this.orderService.createOrderOperation(operationPayload);

    const payPayload: CreateOrderPayDTO = {
      orderId: payload.orderNo,
      price: 0,
      longTime: 0,
      amount: -remainMoney,
      type: ORDER_PAY_TYPE.OUT,
      remark: "订单强制下机",
    };
    await this.orderService.createOrderPay(payPayload);

    return true;
  }

  /**
   * 获取订单操作记录
   */
  @ApiOperation({ summary: "订单操作记录" })
  @ApiListResponse(OrderOperationVO)
  @Get("operation")
  async getOperationList(@Query() query: QueryOrderOperationDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.orderService.getOrderOperationList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 获取所有支付记录
   */
  @ApiOperation({ summary: "订单支付记录" })
  @ApiListResponse(OrderPayVO)
  @Get("pay-list")
  async getPayList(@Query() query: QueryOrderPayDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.orderService.getOrderPayList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }
}
