import { RouteRecordRaw } from "vue-router";

import { ROUTE_NAME } from "@/constants/route";
import { RouterView } from "@/layout/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

const tableBase = () => import("@/views/table/base");
const tableReadme = () => import("@/views/table/readme");
const tableRouteMapping = () => import("@/views/table/routemap");
const tableForm = () => import("@/views/table/withform");
const tableOperate = () => import("@/views/table/operations");
const tableRich = () => import("@/views/table/rich");
const tableDetail = () => import("@/views/table/detail");

export const tableRoute: RouteRecordRaw[] = [
  {
    path: "admin/table",
    name: ROUTE_NAME.table,
    redirect: { name: ROUTE_NAME.tableBasic },
    component: RouterView,
    children: [
      {
        path: "",
        name: ROUTE_NAME.tableReadme,
        component: LazyComponent(tableReadme),
        meta: {
          pageTitle: "menu.readme",
        },
      },
      {
        path: "base",
        name: ROUTE_NAME.tableBasic,
        component: LazyComponent(tableBase),
        meta: {
          pageTitle: "menu.origin-table",
        },
      },
      {
        path: "route-mapping",
        name: ROUTE_NAME.tableRouteMapping,
        component: LazyComponent(tableRouteMapping),
        meta: {
          pageTitle: "menu.table-mapping",
        },
      },
      {
        path: "advance",
        name: ROUTE_NAME.tableAdvance,
        component: RouterView,
        redirect: { name: ROUTE_NAME.tableForm },
        children: [
          {
            path: "form",
            name: ROUTE_NAME.tableForm,
            component: LazyComponent(tableForm),
            meta: {
              pageTitle: "menu.table-form",
            },
          },
          {
            path: "operations",
            name: ROUTE_NAME.tableOperate,
            component: LazyComponent(tableOperate),
            meta: {
              pageTitle: "menu.table-operation",
            },
          },
          {
            path: "complex",
            name: ROUTE_NAME.tableComplex,
            component: LazyComponent(tableRich),
            meta: {
              pageTitle: "menu.table-complex",
            },
          },
          {
            path: "detail/:id",
            name: ROUTE_NAME.tableDetail,
            component: LazyComponent(tableDetail),
            meta: {
              menu: ROUTE_NAME.tableComplex,
              pageTitle: "menu.table-detail",
            },
          },
        ],
      },
    ],
  },
];
