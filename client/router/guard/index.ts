import { Router } from "vue-router";

import { PROJECT_LANGS } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { validateLocale, loadLangResourceAsync } from "@/helper";
import { CancelToken } from "@/helper/request";
import { useUserStore } from "@/store/modules/user";

export async function setupRouterGuard(router: Router) {
  const userStore = useUserStore();

  router.beforeEach(async (to, from, next) => {
    // 清空上个路由请求(针对全局的api,请配置ignoreCancelToken)
    // 对于重试的请求,还需要优化
    CancelToken.instance.clear();

    const isRequireAuth = to.meta.requireAuth !== false;
    const hasLogged = userStore.userState.isLogin;

    if (isRequireAuth && !hasLogged) {
      return next({
        replace: true,
        name: ROUTE_NAME.login,
        query: {
          redirect: encodeURIComponent(to.fullPath),
        },
      });
    }

    if (hasLogged && [ROUTE_NAME.login, ROUTE_NAME.register].includes(to.name as ROUTE_NAME)) {
      return next({
        replace: true,
        name: ROUTE_NAME.dashboard,
      });
    }

    // 多语言
    if (validateLocale(to.params.locale)) {
      await loadLangResourceAsync(to.params.locale as PROJECT_LANGS);
      return next();
    } else {
      await loadLangResourceAsync();
      next();
    }
  });
}
