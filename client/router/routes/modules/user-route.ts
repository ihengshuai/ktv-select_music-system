import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

export const userRoute: RouteRecordRaw[] = [
  {
    path: "user/manage",
    name: ROUTE_NAME.userManage,
    component: LazyComponent(() => import("@/views/user/manage")),
    meta: {
      pageTitle: "menu.user-manage",
    },
  },
  {
    path: "user/password",
    name: ROUTE_NAME.userPassword,
    component: LazyComponent(() => import("@/views/user/password")),
    meta: {
      pageTitle: "menu.user-password",
    },
  },
  {
    path: "user/personal",
    name: ROUTE_NAME.userPersonal,
    component: LazyComponent(() => import("@/views/user/personal")),
    meta: {
      pageTitle: "menu.user-personal",
    },
  },
];
