import { resolve } from "path";
import { cwd } from "process";

import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as Joi from "joi";
import { I18nModule } from "nestjs-i18n";
import { DataSource } from "typeorm";

import { HttpFilter } from "@/common/filter/http.filter";
import { RequestNonceSignatureGuard } from "@/common/guard/request-nonce-signature.guard";
import { CustomI18nResolver } from "@/common/i18n/custom-i18n-resolver";
import { BeautyResponseInterceptor } from "@/common/interceptor/beauty-response.interceptor";
import { LoggerMiddleware } from "@/common/middleware/log.middleware";
import config, { APP_CONFIG, IConfig, IDbConfig } from "@/config";
import { NODE_ENV } from "@/utils/env";

const { DEFAULT_LANGUAGE } = APP_CONFIG;

@Module({
  imports: [
    // 配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(cwd(), "./.env"), resolve(cwd(), "./.env." + NODE_ENV)],
      // ignoreEnvFile: true,
      load: [...Object.values(config)],
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string().valid("development", "production", "testing").required(),
        APP_ID: Joi.string().required(),
      }),
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig>) => {
        return [
          {
            ttl: config.get("APP_CONFIG.TTL_TIME"),
            limit: config.get("APP_CONFIG.TTL_LIMIT"),
          },
        ];
      },
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig>) => {
        const TOKEN_SECRET = config.get("APP_CONFIG.TOKEN_SECRET");
        return {
          secret: TOKEN_SECRET,
          signOptions: {
            expiresIn: "7d",
          },
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IConfig>) => {
        const dbConfig = configService.get<IDbConfig>("DB_CONFIG");
        const __is_Dev__ = configService.get<boolean>("APP_CONFIG.__is_Dev__");

        const rest: TypeOrmModuleOptions = {
          ...dbConfig,
          autoLoadEntities: true,
          synchronize: false,
          // entityPrefix: "t_",
          ...(__is_Dev__
            ? { logger: "advanced-console", logging: ["query", "error", "warn", "log", "migration"] }
            : {}),
        };

        return rest;
      },
      dataSourceFactory: async options => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    // i18n
    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path: resolve(cwd(), "./public/i18n/"),
        watch: false,
      },
      fallbacks: {
        "zh-cn": "zh",
        "zh-*": "zh_hk",
        zh: "zh_hk",
        "en-*": "en",
        "ko-*": "ko",
        "ja-*": "ja",
        "es-*": "es",
      },
      resolvers: [CustomI18nResolver],
      viewEngine: "ejs",
    }),
  ],
  providers: [
    // filter
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
    // pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // 删除发送过来的不存在的属性
        whitelist: true,
        // 将传过来的类型转换为定义的类型，转换为 string、number、boolean和自定义类型
        transform: false,
        transformOptions: {
          enableImplicitConversion: true, // 隐式转换
        },
      }),
    },
    // guard
    {
      provide: APP_GUARD,
      useClass: RequestNonceSignatureGuard,
    },
    // interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: BeautyResponseInterceptor,
    },
  ],
  controllers: [],
})
export class CommonModule implements NestModule {
  // 全局配置中间件 需要实现 NestModule中configure方法
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
