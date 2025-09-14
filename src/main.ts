import { readFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";

import { AppModule } from "./app.module";
import { ViteMiddleware } from "./common/middleware/vite.middleware";
import { initSwagger } from "./common/swagger";
import { APP_CONFIG, type IConfig } from "./config";
import { ConfigDomainEnum } from "./constants";
import { useServerPush } from "./helper/server-push";
import { ApplicationLoggerService } from "./shared/logger/application-logger.service";
import { NODE_ENV } from "./utils/env";

const { __isHttps__, SSL_CERTIFICATE_KEY, SSL_CERTIFICATE } = APP_CONFIG;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ApplicationLoggerService("NestApplication"),
    ...(__isHttps__
      ? {
          httpsOptions: {
            key: readFileSync(SSL_CERTIFICATE_KEY),
            cert: readFileSync(SSL_CERTIFICATE),
          },
        }
      : {}),
  });

  const config = app.get(ConfigService<IConfig>);

  const { __is_Dev__, __is_Prod__, PORT, DB_ENABLE, CLIENT_OUTDIR } = config.get("APP_CONFIG");
  const { host: DB_HOST } = config.get(ConfigDomainEnum.DB_CONFIG);

  if (__isHttps__ && __is_Dev__) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  app.setGlobalPrefix(config.get("APP_CONFIG.API_PREFIX"));

  app.use((req, res: Response, next) => {
    res.removeHeader("X-Powered-By");
    next();
  });

  app.use(ViteMiddleware);
  app.use(cookieParser());

  app.enableCors((req: Request, cb) =>
    cb(null, {
      origin: req.headers.origin,
      methods: ["PUT, POST, GET, DELETE, OPTIONS"],
      allowedHeaders: ["x-locale", "authorization", "Content-Type"],
      credentials: true,
    })
  );

  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 压缩静态资源
  __is_Prod__ &&
    app.use(
      compression({
        filter: (req: Request, res: Response) => {
          if (/\.(woff2|gz|robots\.txt?)/i.test(req.path)) return false;
          return compression.filter(req, res);
        },
      })
    );

  // 静态资源服务
  app.useStaticAssets(resolve(cwd(), "./public"), {
    dotfiles: "deny",
    index: false,
    setHeaders(res: Response, path: string) {
      setCustomCacheControl(res, path);
    },
  });

  // 生产环境增加对客户端静态资源的支持
  __is_Prod__ &&
    app.useStaticAssets(resolve(cwd(), CLIENT_OUTDIR), {
      dotfiles: "deny",
      index: false,
      setHeaders(res: Response, path: string) {
        res.removeHeader("X-Powered-By");
        setCustomCacheControl(res, path);
      },
    });

  // server push
  if (__is_Prod__) {
    app.use(useServerPush);
  }

  // swagger
  initSwagger(app);

  await app.listen(PORT, "0.0.0.0", async () => {
    const url = await app.getUrl();

    const logger = new Logger();

    logger.log(`Application is running at： ${url} (若配置了域名请换成域名)\n`);
    console.log(`   - Env：${NODE_ENV}`);
    DB_ENABLE && console.log(`   - Database：${DB_HOST}`);
  });
}

bootstrap().catch(err => {
  console.log(err);
  process.exit(1);
});

function setCustomCacheControl(res: Response, path: string) {
  if (/.*\.html\??.*/i.test(path)) {
    res.setHeader("Cache-Control", "no-store");
  } else {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
}
