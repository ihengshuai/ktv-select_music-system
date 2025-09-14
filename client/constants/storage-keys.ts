/**
 * 存储相关key
 */

export enum STORAGE_KEYS {
  /**
   * 侧边栏是否收起
   */
  SIDER_COLLAPSED_ = "__I_SIDE_COLLAPSED__",

  /**
   * 是否显示导航标签
   */
  NAVIGATE_TAGS_VISIBLE_ = "__I_NAVIGATE_TAGS_VISIBLE__",

  /**
   * 模拟用户登录cookie key
   */
  USER_LOGIN_COOKIE_ = "__ut",

  /**
   * 深浅主题
   */
  _APP_THEME_MODE_ = "__I_APP_THEME_MODE__",
}

/** app语言过期时间 一年 */
export const APP_LOCALE_EXPIRE = 1000 * 60 * 60 * 24 * 365;
