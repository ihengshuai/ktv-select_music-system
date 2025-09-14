import { h } from "vue";
import { RouteRecordRaw, RouterView } from "vue-router";

import { CustomLoading } from "@/components/common/loading";
import { PERMISSION } from "@/constants/permission";
import { ROUTE_NAME } from "@/constants/route";
import { i18n } from "@/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

const welcome = () => import("@/views/dashboard/welcome");
const analysis = () => import("@/views/dashboard/analysis");

export const dashboardRoute: RouteRecordRaw[] = [
  {
    path: "admin/dashboard",
    name: ROUTE_NAME.dashboard,
    redirect: { name: ROUTE_NAME.welcome },
    meta: {
      pageTitle: "menu.dashboard",
      permission: PERMISSION.DASHBOARD,
    },
    component: RouterView,
    children: [
      {
        path: "welcome",
        name: ROUTE_NAME.welcome,
        component: LazyComponent(welcome),
        meta: {
          pageTitle: "menu.welcome",
        },
      },
      {
        path: "analysis",
        name: ROUTE_NAME.analysis,
        component: LazyComponent({
          loader: analysis,
          loadingComponent: () => h(CustomLoading, () => i18n.global.t("common.customLoading")),
          delay: 2000,
        }),
        meta: {
          pageTitle: "menu.analysis",
        },
      },
    ],
  },
];
