import { ORDER_OPERATION } from "@/constants/order";
import { IBaseDateTime } from "@/typings/common/common";

/** 查询订单操作列表 */
export interface IOrderOperationQueryDTO {
  orderId: string;
}

export interface IOrderOperationVO extends IBaseDateTime {
  orderId: string;
  operation: ORDER_OPERATION;
  remark: string;
}
