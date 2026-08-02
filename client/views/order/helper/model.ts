import { IFormModel } from "@/typings/common/form";
import { ITableFilter } from "@/typings/common/table";
import { IOrderCreateDTO, IOrderQueryDTO } from "@/typings/models/order/order";
import { IOrderPayQueryDTO } from "@/typings/models/order/order-pay";

export function createOrderTableFilter() {
  const filter: ITableFilter<IOrderQueryDTO> = {
    orderNo: {
      value: null,
    },
    validityStatus: {
      value: null,
      immediate: true,
    },
    useStatus: {
      value: null,
      immediate: true,
    },
    createTime: {
      value: null,
      transform: v => (v ? v : null),
    },
    createById: {
      value: null,
    },
  };

  return filter;
}

export function createOrderModel() {
  const model: IFormModel<IOrderCreateDTO> = {
    longTime: {
      value: null,
    },
    operatorPassword: {
      value: null,
    },
  };

  return model;
}

export function createOrderPayTableFilter() {
  const filter: ITableFilter<IOrderPayQueryDTO> = {
    orderId: {
      value: null,
    },
    type: {
      value: null,
      immediate: true,
    },
  };

  return filter;
}
