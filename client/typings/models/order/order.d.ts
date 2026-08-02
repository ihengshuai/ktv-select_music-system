import { ORDER_PAY_STATUS, ORDER_USE_STATUS, ORDER_VALIDITY_STATUS } from "@/constants/order";
import { IBaseDateTime } from "@/typings/common/common";

/** 创建订单 */
export interface IOrderCreateDTO {
  longTime: number;
  operatorPassword: string;
  orderNo?: string;
}

/**
 * 获取订单列表
 */
export interface IOrderQueryDTO {
  orderNo: string;

  validityStatus?: ORDER_VALIDITY_STATUS;
  useStatus?: ORDER_USE_STATUS;

  createTime: string;

  createById: string;
}

/**
 * 强制下线
 */
export interface IForceOfflineDTO {
  orderNo: string;
  operatorPassword: string;
}

/**
 * 续费
 */
export interface IOrderRenewDTO {
  orderNo: string;
  longTime: number;
}

export interface IOrderVO extends IBaseDateTime {
  orderNo: string;
  password: string;
  useStatus: ORDER_USE_STATUS;
  payStatus: ORDER_PAY_STATUS;
  validityStatus: ORDER_VALIDITY_STATUS;
  startTime: string;
  longTime: number;
  amount: number;
  createById: string;
  createAt: string;
  updateById: string;
  updateAt: string;
}
