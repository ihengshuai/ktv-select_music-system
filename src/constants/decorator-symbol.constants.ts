export enum DecoratorSymbol {
  /** 原始响应不走自定义响应处理  */
  ORIGINAL_RESPONSE = "ORIGINAL_RESPONSE",
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
