import { readFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { Request, Response } from "express";

import { APP_CONFIG } from "@/config";

const { CLIENT_OUTDIR, COOKIE_LANG_KEY, DEFAULT_LANGUAGE, COOKIE_DOMAIN } = APP_CONFIG;

export async function useServerPush(req: Request, res: Response, next: Function) {
  const manifest = readFileSync(resolve(cwd(), `${CLIENT_OUTDIR}/.vite/manifest.json`), "utf-8");

  if (!/(^\/api)|(\.(js|css|png|jpg)$)/i.test(req.url) && !/^\/page/i.test(req.url) /* 忽略掉 ejs 页面 */) {
    const beautyManifest = JSON.parse(manifest);
    const htmlManifest = beautyManifest["index.html"];
    if (htmlManifest) {
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
