import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

export const enumCodeRoute: RouteRecordRaw[] = [
  {
    path: "enum-code",
    name: ROUTE_NAME.enumCode,
    component: LazyComponent(() => import("@/views/enum-code/index")),
    meta: {
      pageTitle: "menu.enum-code",
    },
  },
];
