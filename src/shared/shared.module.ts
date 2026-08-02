import { resolve } from "path";
import { cwd } from "process";

import { Global, MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as Joi from "joi";
import { I18nModule } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

import { DbExceptionFilter } from "@/common/filter/db-exception.filter";
import { ValidatorException } from "@/common/filter/exception/exception";
import { GlobalExceptionFilter } from "@/common/filter/global-exception.filter";
import { HttpExceptionFilter } from "@/common/filter/http-exception.filter";
import { RequestNonceSignatureGuard } from "@/common/guard/request-nonce-signature.guard";
import { CustomI18nResolver } from "@/common/i18n/custom-i18n-resolver";
import { BeautyResponseInterceptor } from "@/common/interceptor/beauty-response.interceptor";
import { LoggerMiddleware } from "@/common/middleware/log.middleware";
import config, { APP_CONFIG, DB_CONFIG, IAppConfig, IConfig, IDbConfig } from "@/config";
import { FILE_CONFIG } from "@/config/file.config";
import { OSS_CONFIG } from "@/config/oss.config";
import { CONFIG_DOMAIN_ENUM } from "@/consts";
import { NODE_ENV } from "@/utils/env";

import { FileSystemService } from "./file-system/file-system.service";
import { ApplicationLoggerModule } from "./logger/application-logger.module";
import { SharedScheduleService } from "./schedule/shared-schedule.service";

const { DEFAULT_LANGUAGE } = APP_CONFIG;

@Global()
@Module({
  imports: [
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
        const { TTL_LIMIT, TTL_TIME } = config.get<IAppConfig>("APP_CONFIG");

        return {
          errorMessage: "请求繁忙,请稍后再试...",
          throttlers: [
            {
              ttl: TTL_TIME,
              limit: TTL_LIMIT,
            },
          ],
        };
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
        // const dataSource = await new DataSource(options).initialize();
        // return dataSource;

        return addTransactionalDataSource(new DataSource(options));
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: DEFAULT_LANGUAGE,
      loaderOptions: {
        path: resolve(cwd(), "./public/i18n/"),
        watch: false,
        includeSubfolders: true,
      },
      fallbacks: {
        "zh-cn": "zh",
        "zh-*": "zh_hk",
        zh: "zh",
        "en-*": "en",
        "ko-*": "ko",
        "ja-*": "ja",
        "es-*": "es",
      },
      resolvers: [CustomI18nResolver],
      viewEngine: "ejs",
    }),

    ApplicationLoggerModule,

    ScheduleModule.forRoot(),

    SharedModule.forNsConfig(),
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DbExceptionFilter,
    },

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        // 将传过来的类型转换为定义的类型，转换为 string、number、boolean和自定义类型
        transform: false,
        transformOptions: {
          enableImplicitConversion: true, // 隐式转换
        },
        exceptionFactory(errors) {
          let message = "格式错误";

          const [error] = errors;
          message = error.constraints[Object.keys(error.constraints)[0]];

          return new ValidatorException(message);
        },
      }),
    },

    {
      provide: APP_GUARD,
      useClass: RequestNonceSignatureGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: BeautyResponseInterceptor,
    },

    // SharedScheduleService,

    FileSystemService,
  ],
})
export class SharedModule implements NestModule {
  // 全局配置中间件 需要实现 NestModule中configure方法
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }

  static forNsConfig() {
    const nsConfig = [
      { provide: CONFIG_DOMAIN_ENUM.APP_CONFIG, useValue: APP_CONFIG },
      { provide: CONFIG_DOMAIN_ENUM.DB_CONFIG, useValue: DB_CONFIG },
      { provide: CONFIG_DOMAIN_ENUM.OSS_CONFIG, useValue: OSS_CONFIG },
      { provide: CONFIG_DOMAIN_ENUM.FILE_CONFIG, useValue: FILE_CONFIG },
    ];

    return {
      module: class {},

      global: true,

      providers: [...nsConfig],
      exports: [...nsConfig],
    };
  }
}
