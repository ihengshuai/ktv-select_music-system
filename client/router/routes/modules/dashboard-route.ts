import { h } from "vue";
import { RouteRecordRaw, RouterView } from "vue-router";

import { CustomLoading } from "@/components/common/loading";
import { PERMISSION } from "@/constants/permission";
import { ROUTE_NAME } from "@/constants/route";
import { i18n } from "@/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

const dashboardMusic = () => import("@/views/dashboard/dashboard-music");
const dashboardIncome = () => import("@/views/dashboard/dashboard-income");

export const dashboardRoute: RouteRecordRaw[] = [
  {
    path: "dashboard",
    name: ROUTE_NAME.dashboard,
    redirect: { name: ROUTE_NAME.dashboardMusic },
    meta: {
      pageTitle: "menu.dashboard",
      permission: PERMISSION.DASHBOARD,
    },
    component: RouterView,
    children: [
      {
        path: "music",
        name: ROUTE_NAME.dashboardMusic,
        component: LazyComponent(dashboardMusic),
        meta: {
          pageTitle: "menu.dashboard-music",
        },
      },
      {
        path: "income",
        name: ROUTE_NAME.dashboardIncome,
        component: LazyComponent({
          loader: dashboardIncome,
          loadingComponent: () => h(CustomLoading, () => i18n.global.t("common.customLoading")),
        }),
        meta: {
          pageTitle: "menu.dashboard-income",
        },
      },
    ],
  },
];
