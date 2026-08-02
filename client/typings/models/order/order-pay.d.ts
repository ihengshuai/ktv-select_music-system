import { ORDER_PAY_TYPE } from "@/constants/order";
import { IBaseDateTime } from "@/typings/common/common";

/** 查询订单支付列表 */
export interface IOrderPayQueryDTO {
  orderId?: string;
  type?: ORDER_PAY_TYPE;
}

/** 订单支付信息 */
export interface IOrderPayVO extends IBaseDateTime {
  orderId: string;
  price: number;
  amount: number;
}
