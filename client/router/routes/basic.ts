import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";

const exception = () => import("@/views/system/Exception");

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: "redirect",
    name: ROUTE_NAME.redirect,
    component: {},
  },
  {
    path: ":path(.*)*",
    component: exception,
  },
];
