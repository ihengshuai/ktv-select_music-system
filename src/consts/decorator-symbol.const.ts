/**
 * 自定义注解一些常量
 */
export enum DECORATOR_SYMBOL {
  /** 标识是不是要包装响应体  */
  WRAPPER_RESPONSE = "WRAPPER_RESPONSE",
  /** 渲染页面  */
  RENDER_PAGE_SYMBOL = "RENDER_PAGE_SYMBOL",
  /** 用户角色标识 */
  USER_ROLE_LABEL = "USER_ROLE",
  /** 路由认证 */
  AUTHENTICATION_CONTROLLER = "AUTHENTICATION_CONTROLLER",
  /** 请求签名 */
  HTTP_SIGNATURE = "HTTP_SIGNATURE",
  /** 公共访问 */
  IS_PUBLIC = "IS_PUBLIC",
}
