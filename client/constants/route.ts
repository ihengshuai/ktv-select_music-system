/**
 * 定义路由名,
 * 注意：子路由需要在父路由的基础上拼接 => -子路由名
 * @example
 *  父：dashboard
 *  子：dashboard-analysis
 *  子：dashboard-welcome
 */
export enum ROUTE_NAME {
  // dashboard
  dashboard = "dashboard",
  welcome = "dashboard-welcome",
  analysis = "dashboard-analysis",

  // 图表
  chart = "chart",

  // 表单
  form = "form",
  formBasic = "form-basic",

  // 表格
  table = "table",
  tableReadme = "table-readme",
  tableBasic = "table-basic",
  tableRouteMapping = "table-routemapping",
  tableAdvance = "table-advance",
  tableOperate = "table-advance-operate",
  tableForm = "table-advance-form",
  tableComplex = "table-advance-complex",
  tableDetail = "table-advance-complex-detail",

  // 登录
  login = "login",
  register = "register",

  // 用户
  userManage = "user-manage",
  userPassword = "user-password",
  userPersonal = "user-personal",

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
