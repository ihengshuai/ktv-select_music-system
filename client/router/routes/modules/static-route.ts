import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

export const staticRoute: RouteRecordRaw[] = [
  {
    path: "static/manage",
    name: ROUTE_NAME.staticManager,
    component: LazyComponent(() => import("@/views/static-manage")),
    meta: {
      pageTitle: "menu.static-manager",
    },
  },
];
