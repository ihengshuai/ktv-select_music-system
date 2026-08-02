import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";

export const ClientRoute: RouteRecordRaw[] = [
  {
    path: "search",
    name: ROUTE_NAME.clientSearchMusic,
    component: () => import("@/views/client/client-search-music"),
  },
];
