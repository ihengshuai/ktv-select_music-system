import { setMetadata } from "@hengshuai/helper";

/**
 * 项目受支持的语言
 */
export enum PROJECT_LANGS {
  ZH_CN = "zh",
  /**
   * 英文
   * @description 默认语言
   */
  EN = "en",
}
setMetadata(PROJECT_LANGS, {
  ZH_CN: {
    alias: "中文",
  },
  EN: {
    alias: "English",
  },
});

/**
 * 方向
 */
export enum DIRECTION {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

/**
 * 主题深浅模式
 */
export enum THEME_MODE {
  LIGHT = "light",
  DARK = "dark",
}

/**
 * 列表排序
 */
export enum LIST_SORTER {
  ASC = "asc",
  DESC = "desc",
}

/** antdesign表格排序 */
export enum TABLE_SORT {
  ASC = "ascend",
  DESC = "descend",
}

/**
 * 表格操作
 */
export enum TABLE_OPERATION {
  /**
   * 创建
   */
  CREATE,
  /**
   * 查看
   */
  VIEW,
  /**
   * 编辑
   */
  UPDATE,
  /**
   * 删除
   */
  DELETE,
  /**
   * 置顶
   */
  TOP,
  /** 改变状态 */
  TOGGLE_STATUS,
  /** 重置密码 */
  RESET_PASSWORD,
  /** 角色权限 */
  CHANGE_ROLE,
  // 其他...
}

/**
 * 错误类型
 */
export enum ERROR_TYPE {
  VUE = "vue",
  SCRIPT = "script",
  RESOURCE = "resource",
  AJAX = "ajax",
  PROMISE = "promise",
}

/** 窗口打开方式 */
export enum WINDOW_OPEN_TYPE {
  NEW_TAB = "_blank",
  SELF_TAB = "_self",
  PARENT_TAB = "_parent",
  TOP_TAB = "_top",
}

/** 通用的标签 */
export enum COMMON_LABELS {
  ALL = -1,
}

setMetadata(COMMON_LABELS, {
  ALL: {
    alias: "common.all",
  },
});

/** 导航标签关闭类型 */
export enum NAVIGATE_TAG_CLOSE_TYPE {
  /** 关闭自身 */
  CLOSE_SELF = "closeSelf",
  /** 关闭左侧 */
  CLOSE_LEFT = "closeLeft",
  /** 关闭右侧 */
  CLOSE_RIGHT = "closeRight",
  /** 关闭全部 */
  CLOSE_ALL = "closeAll",
  /** 关闭其他 */
  CLOSE_OTHER = "closeOther",
}

setMetadata(NAVIGATE_TAG_CLOSE_TYPE, {
  CLOSE_LEFT: {
    alias: "common.closeLeftTags",
  },
  CLOSE_RIGHT: {
    alias: "common.closeRightTags",
  },
  CLOSE_ALL: {
    alias: "common.closeAllTags",
  },
  CLOSE_OTHER: {
    alias: "common.closeOtherTags",
  },
});

/** 是/否 */
export enum YoN {
  Y = "Y",
  N = "N",
}
setMetadata(YoN, {
  Y: {
    alias: "是",
  },
  N: {
    alias: "否",
  },
});
