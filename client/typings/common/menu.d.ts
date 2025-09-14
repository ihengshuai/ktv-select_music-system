import { WINDOW_OPEN_TYPE } from "@/constants/common";
import { ROUTE_NAME } from "@/constants/route";
import { VNode } from "vue";

/** 菜单 */
export interface IMenuItem {
  key: string;
  title?: string;
  label?: string;
  disabled?: boolean;
  /** 菜单打开方式 */
  target?: WINDOW_OPEN_TYPE;
  /** 外链 */
  link?: string;
  icon?: () => VNode;
  children?: IMenuItem[];
  /** 控制是否显示 */
  validator?: () => boolean | boolean;
}

/**
 * 导航菜单标签
 */
export interface INavigateMenu {
  to: {
    name: ROUTE_NAME;
    params?: Record<string, any>;
  };
  title?: string;
  closeable?: boolean;
}

/**
 * 面包屑
 */
export interface IBreadcrumb {
  name: ROUTE_NAME;
  title: string;
}
