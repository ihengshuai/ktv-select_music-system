import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { RouterView } from "@/layout/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

const formBasic = () => import("@/views/form");

export const formRoute: RouteRecordRaw[] = [
  {
    path: "admin/form",
    name: ROUTE_NAME.form,
    redirect: { name: ROUTE_NAME.formBasic },
    component: RouterView,
    children: [
      {
        path: "",
        name: ROUTE_NAME.formBasic,
        component: LazyComponent(formBasic),
        meta: {
          pageTitle: "menu.form-basic",
        },
      },
    ],
  },
];
