import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { cwd } from "process";

import { ConfigType, registerAs } from "@nestjs/config";

import { CONFIG_DOMAIN_ENUM, CONFIG_TOKEN_ENUM } from "@/consts";
import { env, envBoolean, envNumber } from "@/utils/env";

export const APP_CONFIG = {
  [CONFIG_TOKEN_ENUM.IS_PROD]: env("NODE_ENV", "development") === "production",
  [CONFIG_TOKEN_ENUM.IS_DEV]: env("NODE_ENV", "development") !== "production",
  [CONFIG_TOKEN_ENUM.IS_HTTPS]: env("SSL_CERTIFICATE") && env("SSL_CERTIFICATE_KEY") ? true : false,
  [CONFIG_TOKEN_ENUM.NODE_ENV]: env("NODE_ENV", "development"),
  [CONFIG_TOKEN_ENUM.PORT]: envNumber("PORT", 5000),
  [CONFIG_TOKEN_ENUM.API_PREFIX]: env("API_PREFIX", "/api"),
  [CONFIG_TOKEN_ENUM.COOKIE_DOMAIN]: env(CONFIG_TOKEN_ENUM.COOKIE_DOMAIN, "localhost"),
  [CONFIG_TOKEN_ENUM.COOKIE_LANG_KEY]: env(CONFIG_TOKEN_ENUM.COOKIE_LANG_KEY, "__lang"),
  [CONFIG_TOKEN_ENUM.DEFAULT_LANGUAGE]: env(CONFIG_TOKEN_ENUM.DEFAULT_LANGUAGE, "en"),
  [CONFIG_TOKEN_ENUM.APP_TITLE]: env(CONFIG_TOKEN_ENUM.APP_TITLE, "NestApplication"),
  [CONFIG_TOKEN_ENUM.APP_ID]: env(CONFIG_TOKEN_ENUM.APP_ID),
  // TOKEN
  [CONFIG_TOKEN_ENUM.TOKEN_COOKIE]: env(CONFIG_TOKEN_ENUM.TOKEN_COOKIE, "__ut"),
  [CONFIG_TOKEN_ENUM.TOKEN_SECRET]: env(CONFIG_TOKEN_ENUM.TOKEN_SECRET),
  // 客户端编译目录
  [CONFIG_TOKEN_ENUM.CLIENT_OUTDIR]: env(CONFIG_TOKEN_ENUM.CLIENT_OUTDIR, "dist/client"),
  // 忽略签名
  [CONFIG_TOKEN_ENUM.SIGNATURE_IGNORE]: envBoolean(CONFIG_TOKEN_ENUM.SIGNATURE_IGNORE, false),
  // TTL
  [CONFIG_TOKEN_ENUM.TTL_TIME]: envNumber(CONFIG_TOKEN_ENUM.TTL_TIME, 1000),
  [CONFIG_TOKEN_ENUM.TTL_LIMIT]: envNumber(CONFIG_TOKEN_ENUM.TTL_LIMIT, 1000 * 30),
  // hmr端口
  [CONFIG_TOKEN_ENUM.HMR_PORT]: envNumber(CONFIG_TOKEN_ENUM.HMR_PORT, 12071),
  // 证书
  [CONFIG_TOKEN_ENUM.SSL_CERTIFICATE]: env(CONFIG_TOKEN_ENUM.SSL_CERTIFICATE),
  [CONFIG_TOKEN_ENUM.SSL_CERTIFICATE_KEY]: env(CONFIG_TOKEN_ENUM.SSL_CERTIFICATE_KEY),
  // 是否使用数据库
  [CONFIG_TOKEN_ENUM.DB_ENABLE]: !!env("DB_HOST")?.length,
  // 用户配置,是否已经初始化root用户了
  [CONFIG_TOKEN_ENUM.HAVE_ROOT]: false,
};

/** 程序启动时检测root用户是否已经初始化 */
export async function toggleSystemInitStatus(rootText?: string) {
  const rootUserPath = resolve(cwd(), "./.db/root");

  if (rootText) {
    await writeFile(rootUserPath, rootText, "utf-8");
  }

  const hasRoot = await existsSync(rootUserPath);

  if (!hasRoot) {
    return (APP_CONFIG[CONFIG_TOKEN_ENUM.HAVE_ROOT] = false);
  }

  return (APP_CONFIG[CONFIG_TOKEN_ENUM.HAVE_ROOT] = true);
}

export const AppConfig = registerAs(CONFIG_DOMAIN_ENUM.APP_CONFIG, () => APP_CONFIG);

export type IAppConfig = ConfigType<typeof AppConfig>;
