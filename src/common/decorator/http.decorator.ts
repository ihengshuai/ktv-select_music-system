import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Request } from "express";

import { DECORATOR_SYMBOL } from "@/consts";

/** 标识当前响应不走自定义响应处理 */
export const NoWrapResponse = () => SetMetadata(DECORATOR_SYMBOL.WRAPPER_RESPONSE, false);

/** 获取请求协议 */
export const Protocol = createParamDecorator((defaultValue: string, ctx: ExecutionContext) => {
  if (defaultValue) return defaultValue;
  const request = ctx.switchToHttp();
  return request.getRequest<Request>().protocol;
});

/** 获取请求cookie */
export const Cookie = createParamDecorator((defaultValue: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp();
  const req = request.getRequest<Request>();
  return (defaultValue && req.cookies[defaultValue]) || req.cookies;
});

/** 获取请求token */
export const Token = createParamDecorator((defaultValue = "__token__", ctx: ExecutionContext) => {
  const request = ctx.switchToHttp();
  const req = request.getRequest<Request>();
  return defaultValue && req[defaultValue];
});

/** 请求签名 */
export const HttpSignature = (bool = true) => SetMetadata(DECORATOR_SYMBOL.HTTP_SIGNATURE, bool);

/** 获取请求路径 */
export const RequestPath = createParamDecorator((defaultValue: string, ctx: ExecutionContext) => {
  if (defaultValue) return defaultValue;
  const request = ctx.switchToHttp();
  return request.getRequest<Request>().path;
});
