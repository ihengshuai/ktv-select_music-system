import { readFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { Request, Response } from "express";

import { APP_CONFIG } from "@/config";

const { CLIENT_OUTDIR, COOKIE_LANG_KEY, DEFAULT_LANGUAGE, COOKIE_DOMAIN } = APP_CONFIG;

export async function useServerPush(req: Request, res: Response, next: Function) {
  const manifest = readFileSync(resolve(cwd(), `${CLIENT_OUTDIR}/.vite/manifest.json`), "utf-8");

  if (!/(^\/api)|(\.(js|css|png|jpg)$)/i.test(req.url)) {
    // TODO: 这里只是简单的将html页面默认的资源进行推送
    // 若需要根据路由推送，客户端需要将chunkName对应没有路由文件和路由，目前还没有相关插件
    const beautyManifest = JSON.parse(manifest);
    const htmlManifest = beautyManifest["index.html"];
    if (htmlManifest) {
      // 没有cookie根据浏览器进行判断需要推送的语言包
      const agentLanguages = req.header("Accept-Language") || "";
      const agentLanguage = agentLanguages.split(",")?.[0]?.replace(/(_|-).*/, "");
      const lang = req.cookies[COOKIE_LANG_KEY] || agentLanguage || DEFAULT_LANGUAGE;
      res.cookie(COOKIE_LANG_KEY, lang, { maxAge: 31536000, domain: COOKIE_DOMAIN });

      // 页面所需要的资源
      const { file, imports, css } = htmlManifest;
      let serverPushStack = [];
      serverPushStack.push(`<${req.baseUrl}/${file}>; rel=preload; as=script; crossorigin`);
      imports.forEach(src =>
        serverPushStack.push(`<${req.baseUrl}/${beautyManifest[src]["file"]}>; rel=preload; as=script; crossorigin`)
      );
      css.forEach(src => serverPushStack.push(`<${req.baseUrl}/${src}>; rel=preload; as=style; crossorigin`));
      serverPushStack.push(`<${req.baseUrl}/i18n/${lang}.json>; rel=preload; as=fetch; crossorigin`);
      if (serverPushStack.length) {
        res.setHeader("Link", serverPushStack.join(", "));
      }
    }
  }

  res.removeHeader("X-Powered-By");

  next();
}
