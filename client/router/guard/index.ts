import { Router } from "vue-router";

import { PROJECT_LANGS } from "@/constants/common";
import { HTTP_CODE } from "@/constants/http.const";
import { ROUTE_NAME } from "@/constants/route";
import { validateLocale, loadLangResourceAsync } from "@/helper";
import { CancelToken } from "@/helper/request";
import { useUserStore } from "@/store/modules/user";

export async function setupRouterGuard(router: Router) {
  const userStore = useUserStore();

  router.beforeEach(async (to, from, next) => {
    CancelToken.instance.clear();

    const isRequireAuth = to.meta.requireAuth !== false;
    const hasLogged = userStore.userState.isLogin;

    if (userStore.userState.code === HTTP_CODE.SYSTEM_NOT_INIT && to.name !== ROUTE_NAME.systemInit) {
      return next({ replace: true, name: ROUTE_NAME.systemInit });
    }

    if (to.name === ROUTE_NAME.systemInit && userStore.userState.code !== HTTP_CODE.SYSTEM_NOT_INIT) {
      return next({ replace: true, name: ROUTE_NAME.adminHome });
    }

    if (isRequireAuth && !hasLogged && to.path.startsWith("/admin")) {
      return next({
        replace: true,
        name: ROUTE_NAME.login,
        query: {
          redirect: encodeURIComponent(to.fullPath),
        },
      });
    }

    if (hasLogged && [ROUTE_NAME.systemInit, ROUTE_NAME.login, ROUTE_NAME.register].includes(to.name as ROUTE_NAME)) {
      return next({
        replace: true,
        name: ROUTE_NAME.dashboard,
      });
    }

    if (validateLocale(to.params.locale)) {
      await loadLangResourceAsync(to.params.locale as PROJECT_LANGS);
      return next();
    } else {
      await loadLangResourceAsync();
      next();
    }
  });
}
