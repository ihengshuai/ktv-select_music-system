import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { LazyComponent } from "@/layout/page/lazy-component";

const chart = () => import("@/views/chart");

export const chartRoute: RouteRecordRaw[] = [
  {
    path: "admin/chart",
    name: ROUTE_NAME.chart,
    component: LazyComponent(chart),
  },
];
