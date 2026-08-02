import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import { IListResult, type IListQuery } from "@/typings/common/table";
import type { IForceOfflineDTO, IOrderCreateDTO, IOrderQueryDTO, IOrderVO } from "@/typings/models/order/order";
import { IOrderOperationQueryDTO, IOrderOperationVO } from "@/typings/models/order/order-operation";
import { IOrderPayQueryDTO, IOrderPayVO } from "@/typings/models/order/order-pay";

/**
 * 订单
 */
@Controller("/order")
export class OrderController extends BaseController {
  /**
   * 订单列表
   */
  @Get("")
  async getOrderList(query?: IListQuery<IOrderQueryDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IOrderVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 订单详情
   */
  @Get("/detail/{orderNo}")
  async getOrderDetail(orderNo: string, config?: IHttpRequestConfig) {
    return this.send<IOrderVO>({
      urlPath: { orderNo },
      ...config,
    });
  }

  /**
   * 创建订单
   */
  @Post()
  async createOrder(data: IOrderCreateDTO, config?: IHttpRequestConfig) {
    return this.send<IOrderVO>({
      data,
      ...config,
    });
  }

  /**
   * 续费
   */
  @Post("/renew")
  async renew(data: IOrderCreateDTO, config?: IHttpRequestConfig) {
    return this.send<IOrderVO>({
      data,
      ...config,
    });
  }

  /**
   * 结账下机
   */
  @Post("/force-offline")
  async forceOffline(data: IForceOfflineDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      data,
      ...config,
    });
  }

  /**
   * 获取付款记录
   */
  @Get("/pay-list")
  async getPayList(params?: IListQuery<IOrderPayQueryDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IOrderPayVO>>({
      params,
      ...config,
    });
  }

  /**
   * 获取订单操作记录
   */
  @Get("/operation")
  async getOrderOperationList(params?: IListQuery<IOrderOperationQueryDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IOrderOperationVO>>({
      params,
      ...config,
    });
  }
}
