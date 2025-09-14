/**
 * https://cn.vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
 */

import "vue-router";
import "vue";
import type { RouteRecord } from "vue-router";
import { PERMISSION } from "@/constants/permission";
import { ROUTE_NAME, ROUTE_TRANSITION_MODE } from "@/constants/route";
import { IDict } from "./common/type";

declare module "vue" {
  interface ComponentCustomProperties {
    /**
     * 自定义vue实例原型方法
     */
    $f: () => void;
  }
}

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 权限
     */
    permission?: PERMISSION;

    /**
     * 页面标题
     */
    pageTitle?: string;

    /**
     * 属于哪一个菜单(菜单高亮)
     */
    menu?: ROUTE_NAME;

    parent?: {
      name: ROUTE_NAME;
      pageTitle: string;
    };

    /**
     * 页面过渡行为
     */
    pageTransitionMode?: ROUTE_TRANSITION_MODE;

    /**
     * 是否要登录
     */
    requireAuth?: boolean;

    /**
     * 缓存
     */
    keepAlive?: boolean;

    /**
     * 滚动到顶部
     */
    scrollToTop?: boolean;
  }

  declare interface MatcherLocation {
    name: ROUTE_NAME;
  }

  interface _RouteRecordBase {
    name?: ROUTE_NAME | string;
    path: string;
    children?: RouteConfig[];
    redirect?: RedirectOption;
    alias?: string | string[];
    meta?: RouteMeta;
    beforeEnter?: NavigationGuard;
    caseSensitive?: boolean;
    pathToRegexpOptions?: PathToRegexpOptions;
    component?: Component;
  }
}
