import { ConfigType, registerAs } from "@nestjs/config";

import { ConfigDomainEnum, ConfigTokenEnum } from "@/constants";
import { env, envBoolean, envNumber } from "@/utils/env";

export const APP_CONFIG = {
  [ConfigTokenEnum.IS_PROD]: env("NODE_ENV", "development") === "production",
  [ConfigTokenEnum.IS_DEV]: env("NODE_ENV", "development") !== "production",
  [ConfigTokenEnum.IS_HTTPS]: env("SSL_CERTIFICATE") && env("SSL_CERTIFICATE_KEY") ? true : false,
  [ConfigTokenEnum.NODE_ENV]: env("NODE_ENV", "development"),
  [ConfigTokenEnum.PORT]: envNumber("PORT", 5000),
  [ConfigTokenEnum.API_PREFIX]: env("API_PREFIX", "/api"),
  [ConfigTokenEnum.COOKIE_DOMAIN]: env(ConfigTokenEnum.COOKIE_DOMAIN, "localhost"),
  [ConfigTokenEnum.COOKIE_LANG_KEY]: env(ConfigTokenEnum.COOKIE_LANG_KEY, "__lang"),
  [ConfigTokenEnum.DEFAULT_LANGUAGE]: env(ConfigTokenEnum.DEFAULT_LANGUAGE, "en"),
  [ConfigTokenEnum.APP_TITLE]: env(ConfigTokenEnum.APP_TITLE, "NestApplication"),
  [ConfigTokenEnum.APP_ID]: env(ConfigTokenEnum.APP_ID),
  // TOKEN
  [ConfigTokenEnum.TOKEN_COOKIE]: env(ConfigTokenEnum.TOKEN_COOKIE, "__ut"),
  [ConfigTokenEnum.TOKEN_SECRET]: env(ConfigTokenEnum.TOKEN_SECRET),
  // 客户端编译目录
  [ConfigTokenEnum.CLIENT_OUTDIR]: env(ConfigTokenEnum.CLIENT_OUTDIR, "dist/client"),
  // 忽略签名
  [ConfigTokenEnum.SIGNATURE_IGNORE]: envBoolean(ConfigTokenEnum.SIGNATURE_IGNORE, false),
  // TTL
  [ConfigTokenEnum.TTL_TIME]: envNumber(ConfigTokenEnum.TTL_TIME, 1000),
  [ConfigTokenEnum.TTL_LIMIT]: envNumber(ConfigTokenEnum.TTL_LIMIT, 1000 * 30),
  // hmr端口
  [ConfigTokenEnum.HMR_PORT]: envNumber(ConfigTokenEnum.HMR_PORT, 12071),
  // 证书
  [ConfigTokenEnum.SSL_CERTIFICATE]: env(ConfigTokenEnum.SSL_CERTIFICATE),
  [ConfigTokenEnum.SSL_CERTIFICATE_KEY]: env(ConfigTokenEnum.SSL_CERTIFICATE_KEY),
  // 是否使用数据库
  [ConfigTokenEnum.DB_ENABLE]: !!env("DB_HOST")?.length,
};

export const AppConfig = registerAs(ConfigDomainEnum.APP_CONFIG, () => APP_CONFIG);

export type IAppConfig = ConfigType<typeof AppConfig>;
