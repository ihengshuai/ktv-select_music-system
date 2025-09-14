import { ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { I18nResolver } from "nestjs-i18n";

@Injectable()
export class CustomI18nResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | string[] | Promise<string | string[]> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    // TODO: 这里简单的对语言值进行判断，根据实际业务调整
    let locale = request.params.locale;
    if (!locale) {
      locale = request.query.locale as string;
    }
    if (!locale) {
      const acceptLang = request.headers["accept-language"];
      locale = acceptLang?.split(",")?.[0] || "en";
    }
    locale = locale?.replace(/-/i, "_");

    if (locale.startsWith("zh")) return "zh";
    return "en";
  }
}
