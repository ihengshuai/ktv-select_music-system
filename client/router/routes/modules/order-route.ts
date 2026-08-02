import { RouteRecordRaw, RouterView } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

export const orderRoute: RouteRecordRaw[] = [
  {
    path: "order",
    name: ROUTE_NAME.order,
    redirect: { name: ROUTE_NAME.orderList },
    component: RouterView,
    children: [
      {
        path: "",
        name: ROUTE_NAME.orderList,
        component: LazyComponent(() => import("@/views/order")),
        meta: {
          pageTitle: "menu.order",
        },
      },

      {
        path: "detail/:orderNo",
        name: ROUTE_NAME.orderDetail,
        component: LazyComponent(() => import("@/views/order/children/order-detail")),
        meta: {
          pageTitle: "menu.order-detail",
          menu: ROUTE_NAME.orderList,
        },
      },

      {
        path: "pay",
        name: ROUTE_NAME.orderPay,
        component: LazyComponent(() => import("@/views/order/children/order-pay")),
        meta: {
          pageTitle: "menu.order-pay",
        },
      },
    ],
  },
];
