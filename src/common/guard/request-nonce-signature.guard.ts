import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
// @ts-ignore
import md5 from "md5";

import { APP_CONFIG } from "@/config";
import { ConfigTokenEnum, DecoratorSymbol } from "@/constants";

const signatureKey = "signature";

@Injectable()
export class RequestNonceSignatureGuard implements CanActivate {
  appConfig = APP_CONFIG;
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.appConfig.__is_Dev__ && this.appConfig[ConfigTokenEnum.SIGNATURE_IGNORE]) return true;

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const signatureRequired =
      this.reflector?.get<boolean>(DecoratorSymbol.HTTP_SIGNATURE, context.getHandler()) ??
      this.reflector?.get<boolean>(DecoratorSymbol.HTTP_SIGNATURE, context.getClass()) ??
      true;

    if (!signatureRequired) return true;

    const query = { ...request.query };
    const data = { ...request.body };

    const signature = query[signatureKey];

    if (!signature) throw new BadRequestException("签名错误");

    delete query[signatureKey];

    let str = "";
    if (query) {
      str += Object.keys(query)
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
        .map(key => `${key}=${query[key] || ""}`)
        .join("&");
    }

    if (data) {
      str += Object.keys(data)
        .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
        .map(key => `${key}=${data[key] ?? null}`)
        .join("&");
    }

    const _signature = md5(str);

    if (_signature !== signature) throw new BadRequestException("签名错误");

    return true;
  }
}
