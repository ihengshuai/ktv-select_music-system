import { defineStore } from "pinia";
import { computed, reactive } from "vue";

import { IOrderVO } from "@/typings/models/order/order";

type NullableRecord<T> = {
  [K in keyof T]: T[K] | null;
};

export const useMusicOrder = defineStore("musicOrder", () => {
  const order = reactive<NullableRecord<IOrderVO>>({
    orderNo: null,
    password: null,
    useStatus: null,
    payStatus: null,
    validityStatus: null,
    startTime: null,
    longTime: null,
    amount: null,
    createById: null,
    createAt: null,
    updateById: null,
    updateAt: null,
    createTime: null,
    updateTime: null,
  });

  const hasLogin = computed(() => order.orderNo && order.password);

  function setOrder(orderVO: IOrderVO) {
    Object.assign(order, orderVO);
  }

  return {
    order,
    hasLogin,

    setOrder,
  };
});
