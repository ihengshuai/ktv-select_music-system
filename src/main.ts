import { readFileSync } from "fs";
import { resolve } from "path";
import { cwd } from "process";

import { Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import { initializeTransactionalContext } from "typeorm-transactional";

import { AppModule } from "./app.module";
import { ViteMiddleware } from "./common/middleware/vite.middleware";
import { initSwagger } from "./common/swagger";
import { APP_CONFIG, IAppConfig, IConfig, IDbConfig, toggleSystemInitStatus } from "./config";
import { useServerPush } from "./helper/server-push";
import { ApplicationLoggerService } from "./shared/logger/application-logger.service";

class Application {
  static instance: Application;

  isReady: boolean;

  app: NestExpressApplication;

  config: ConfigService<IConfig>;

  private constructor() {
    this.isReady = false;
  }

  async init() {
    const { __isHttps__, SSL_CERTIFICATE_KEY, SSL_CERTIFICATE } = APP_CONFIG;

    initializeTransactionalContext();

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

    this.app = app;
    this.config = this.app.get(ConfigService<IConfig>);

    await toggleSystemInitStatus();

    await this.initMiddleware();

    await this.listen();

    this.isReady = true;
  }

  private async initMiddleware() {
    const app = this.app;

    const { __isHttps__, __is_Dev__, __is_Prod__, CLIENT_OUTDIR, API_PREFIX } =
      this.config.get<IAppConfig>("APP_CONFIG");

    if (__isHttps__ && __is_Dev__) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    app.setGlobalPrefix(API_PREFIX, {
      exclude: ["/page(.*)"],
    });

    app.use((req, res: Response, next) => {
      res.removeHeader("X-Powered-By");
      next();
    });

    app.use(cookieParser());

    app.use(ViteMiddleware);

    app.setBaseViewsDir(resolve(__dirname, "./views"));
    app.setViewEngine("ejs");

    app.enableCors((req: Request, cb) =>
      cb(null, {
        origin: req.headers.origin,
        methods: ["PUT, POST, GET, DELETE, OPTIONS"],
        allowedHeaders: ["x-locale", "authorization", "Content-Type"],
        credentials: true,
      })
    );

    app.enableVersioning({
      type: VersioningType.URI,
    });

    if (__is_Prod__) {
      app.use(
        compression({
          filter: (req: Request, res: Response) => {
            if (/\.(woff2|gz|robots\.txt?)/i.test(req.path)) return false;
            return compression.filter(req, res);
          },
        })
      );
    }

    // 静态资源服务
    app.useStaticAssets(resolve(cwd(), "./public"), {
      dotfiles: "deny",
      index: false,
      setHeaders(res: Response, path: string) {
        self.setCustomCacheControl(res, path);
      },
    });

    const self = this;

    if (__is_Prod__) {
      app.useStaticAssets(resolve(cwd(), CLIENT_OUTDIR), {
        dotfiles: "deny",
        index: false,
        setHeaders(res: Response, path: string) {
          res.removeHeader("X-Powered-By");
          self.setCustomCacheControl(res, path);
        },
      });
    }

    if (__is_Prod__) app.use(useServerPush);

    initSwagger(app);
  }

  private async listen() {
    const app = this.app;

    const { NODE_ENV, DB_ENABLE, PORT } = this.config.get<IAppConfig>("APP_CONFIG");
    const { host: DB_HOST, port: DB_PORT } = this.config.get<IDbConfig>("DB_CONFIG");

    await app.listen(PORT, "0.0.0.0", async () => {
      const url = await app.getUrl();

      const logger = new Logger(Application.name);

      console.log("\n\n");
      logger.log(`Application is running at： ${url} (若配置了域名请换成域名)\n`);
      console.log(`   - Env：${NODE_ENV}`);
      DB_ENABLE && console.log(`   - Database：${DB_HOST}:${DB_PORT}`);

      console.log("\n\n");
    });
  }

  private setCustomCacheControl(res: Response, path: string) {
    if (/.*\.html\??.*/i.test(path)) {
      res.setHeader("Cache-Control", "no-store");
    } else {
      res.setHeader("Cache-Control", "public, max-age=31536000");
    }
  }

  static async start() {
    if (!Application.instance) {
      Application.instance = new Application();

      await Application.instance.init();
    }
  }
}

Application.start().catch(e => {
  console.error(e);

  process.exit(1);
});
