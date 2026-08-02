import { App } from "vue";
import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";

import { useConfig } from "@/config";
import { ROUTE_NAME } from "@/constants/route";
import { RouterView } from "@/layout/helper";
import { LazyComponent } from "@/layout/page/lazy-component";

import { baseRoutes } from "./routes/basic";
import { authRoute } from "./routes/modules/auth-route";
import { ClientRoute } from "./routes/modules/client-route";
import { dashboardRoute } from "./routes/modules/dashboard-route";
import { enumCodeRoute } from "./routes/modules/enum-code-route";
import { musicRoute } from "./routes/modules/music-route";
import { orderRoute } from "./routes/modules/order-route";
import { staticRoute } from "./routes/modules/static-route";
import { userRoute } from "./routes/modules/user-route";

const config = useConfig();
const Layout = () => import("@/layout/default");
const ClientLayout = () => import("@/layout/page/client-layout");

const routes: RouteRecordRaw[] = [
  {
    path: `/:locale(${config.LANGUAGES.join("|")})?/`,
    component: RouterView,
    children: [
      {
        path: "",
        redirect: { name: ROUTE_NAME.clientHome },
        component: ClientLayout,
        children: [
          {
            path: "",
            name: ROUTE_NAME.clientHome,
            component: LazyComponent(() => import("@/views/client/client-home-music")),
            meta: {
              title: "menu.client-home",
            },
          },
          ...ClientRoute,
        ],
      },

      {
        path: "admin",
        redirect: { name: ROUTE_NAME.adminHome },
        component: Layout,

        children: [
          {
            path: "",
            name: ROUTE_NAME.adminHome,
            component: LazyComponent(() => import("@/views/home")),
            meta: {
              title: "menu.home",
            },
          },

          ...dashboardRoute,
          ...userRoute,
          ...staticRoute,
          ...enumCodeRoute,
          ...musicRoute,
          ...orderRoute,
        ],
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
