import { App } from "vue";
import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import { useConfig } from "@/config";
import { ROUTE_NAME } from "@/constants/route";
import { RouterView } from "@/layout/helper";

import { baseRoutes } from "./routes/basic";
import { authRoute } from "./routes/modules/auth-route";
import { chartRoute } from "./routes/modules/chart-route";
import { dashboardRoute } from "./routes/modules/dashboard-route";
import { formRoute } from "./routes/modules/form-route";
import { tableRoute } from "./routes/modules/table-routes";
import { userRoute } from "./routes/modules/user-route";

const config = useConfig();
const Layout = () => import("@/layout/default");
// TODO: 路由文件如果能和路由保持一致，可以在访问页面时，通过manifest拿到当前路由的所有资源
// 通过server push 推送页面资源提高性能

// 这里不使用动态路由,有需要自行使用addRoute
const routes: RouteRecordRaw[] = [
  {
    path: `/:locale(${config.LANGUAGES.join("|")})?/`,
    component: RouterView,
    children: [
      {
        path: "",
        redirect: { name: ROUTE_NAME.dashboard },
        component: Layout,
        children: [...dashboardRoute, ...chartRoute, ...formRoute, ...tableRoute, ...userRoute],
      },
      ...baseRoutes,
      ...authRoute,

      {
        path: "testing",
        name: "testing",
        component: () => import("@/views/testing"),
      },
    ],
  },
];

const router = createRouter({
  history:
    config.API_DOMAIN === "/github-page-mock"
      ? createWebHashHistory(config.PUBLIC_PATH)
      : createWebHistory(config.PUBLIC_PATH),
  routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.keepAlive || to.fullPath === from.fullPath || to.meta.scrollToTop === false)
      return savedPosition || false;
    return { behavior: "smooth", top: 0, left: 0 };
  },
});

export { Layout };
export * from "./guard";
export function setupRouter(app: App) {
  app.use(router);

  return router;
}
