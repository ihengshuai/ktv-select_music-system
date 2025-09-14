/**
 * 项目配置
 */

import { App } from "vue";

import { PROJECT_LANGS } from "@/constants/common";
import { IConfig } from "@/typings/common/config";

// eslint-disable-next-line no-unused-vars
export function useConfig(app?: App): IConfig {
  const config = {
    APP_TITLE: import.meta.env.VITE_APP_TITLE || "App Title",
    API_DOMAIN: import.meta.env.VITE_API_DOMAIN || "",
    API_PREFIX: import.meta.env.VITE_API_PREFIX || "/api",
    PUBLIC_PATH: import.meta.env.VITE_BASE_URL || "/",
    APP_ID: import.meta.env.VITE_APP_ID,
    ENV: import.meta.env.MODE as any,
    __VERSION__: import.meta.env.VITE___VERSION__,
    __isDev__: import.meta.env.DEV,
    __isProd__: import.meta.env.PROD,
    TIMEOUT: parseInt(import.meta.env.VITE_TIMEOUT) || 1000 * 60 * 6,
    LANGUAGES: normalizeLanguage(),
    DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || PROJECT_LANGS.EN,
    COOKIE_DOMAIN: import.meta.env.VITE_COOKIE_DOMAIN || "localhost",
    COOKIE_LANG_KEY: import.meta.env.VITE_COOKIE_LANG_KEY || "__lang",
  };

  if (!config.APP_ID) throw new Error("APP_ID is required");

  return config;
}

// @ts-ignore
import.meta.env.DEV && (window.useConfig = useConfig);

// 处理语言
function normalizeLanguage(): PROJECT_LANGS[] {
  let langs: any = import.meta.env.VITE_LANGUAGES || "";
  if (!langs) return [PROJECT_LANGS.EN, PROJECT_LANGS.ZH_CN];
  langs = langs.split(",");
  const res: PROJECT_LANGS[] = [];
  if (!langs?.length) return [PROJECT_LANGS.EN, PROJECT_LANGS.ZH_CN];
  for (let i = 0; i < langs?.length; i++) {
    if (
      Object.entries(PROJECT_LANGS)
        .map(([, v]) => v)
        .includes(langs[i])
    ) {
      res.push(langs[i]);
    }
  }
  return res?.length ? res : [PROJECT_LANGS.EN, PROJECT_LANGS.ZH_CN];
}
