import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

export const authRoute: RouteRecordRaw[] = [
  {
    path: "system-init",
    name: ROUTE_NAME.systemInit,
    component: LazyComponent(() => import("@/views/auth/system-init")),
    meta: {
      pageTitle: "menu.register",
      requireAuth: false,
    },
  },
  {
    path: "login",
    name: ROUTE_NAME.login,
    component: LazyComponent(() => import("@/views/auth/login")),
    meta: {
      pageTitle: "menu.login",
      requireAuth: false,
    },
  },
  {
    path: "register",
    name: ROUTE_NAME.register,
    component: LazyComponent(() => import("@/views/auth/register")),
    meta: {
      pageTitle: "menu.register",
      requireAuth: false,
    },
  },
];
