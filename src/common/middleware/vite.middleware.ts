import { readFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { NextFunction, Request, Response } from "express";
import { ViteDevServer, createServer as createViteServer } from "vite";

import { APP_CONFIG } from "@/config";
import { YON } from "@/consts";
import { env } from "@/utils/env";

const { __is_Prod__, __isHttps__, HMR_PORT, SSL_CERTIFICATE, SSL_CERTIFICATE_KEY, API_PREFIX } = APP_CONFIG;

let viteIns: ViteDevServer;
export async function ViteMiddleware(req: Request, res: Response, next: NextFunction) {
  const isOnlyServer = env("ONLY_SERVER") === YON.Y;

  if (isOnlyServer || __is_Prod__ || req.url.startsWith("/page") /* 过滤掉ejs控制器,若没有可删除 */) {
    return next();
  }
  if (!viteIns) {
    viteIns = await createViteServer({
      server: {
        middlewareMode: true,
        ...(__isHttps__
          ? {
              https: {
                key: readFileSync(SSL_CERTIFICATE_KEY),
                cert: readFileSync(SSL_CERTIFICATE),
              },
            }
          : {}),
        hmr: {
          host: "localhost",
          port: HMR_PORT,
        },
      },
      appType: "spa",
      configFile: resolve(cwd(), "./vite.config.ts"),
    });
  }

  const whiteListRegExp = new RegExp(`^${API_PREFIX}.+$`);

  // if (/^\/[^api|vite].+$/.test(req.url)) {
  if (!whiteListRegExp.test(req.url)) {
    return viteIns.middlewares.handle(req, res, next as any) as any;
  }
  next();
}
