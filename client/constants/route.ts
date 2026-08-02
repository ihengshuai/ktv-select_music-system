/**
 * 定义路由名,
 * 注意：子路由需要在父路由的基础上拼接 => -子路由名
 * @example
 *  父：dashboard
 *  子：dashboard-analysis
 *  子：dashboard-welcome
 */
export enum ROUTE_NAME {
  // ====================== 客户端 ======================
  clientHome = "clientHome",
  clientSearchMusic = "clientSearchMusic",

  // ====================== 管理端 ======================
  adminHome = "adminHome",

  // dashboard
  dashboard = "dashboard",
  dashboardMusic = "dashboard-music",
  dashboardIncome = "dashboard-income",

  // 枚举编码
  enumCode = "enum-code",

  // 曲库管理
  music = "music",
  musicList = "music-list",
  musicCreate = "music-create",
  musicUpdate = "music-update",
  musicLyrics = "music-lyrics",
  musicSinger = "music-singer",
  musicTag = "music-tag",
  musicRegion = "music-region",
  musicStyle = "music-style",
  musicLanguage = "music-language",

  // 订单管理
  order = "order",
  orderList = "order-list",
  orderDetail = "order-list-detail",
  orderPay = "order-pay",

  // 登录
  login = "login",
  register = "register",
  systemInit = "system-init",

  // 用户
  userManage = "user-manage",
  userPassword = "user-password",
  userPersonal = "user-personal",

  // 文件
  staticManager = "static-manager",

  // 其他
  redirect = "redirect",
}

/**
 * 路由切换过渡行为(前进、后退)
 */
export enum ROUTE_TRANSITION_MODE {
  GO,
  BACK,
}
