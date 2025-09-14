/**
 * https://cn.vitejs.dev/guide/env-and-mode#intellisense
 */

/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMetaEnv {
  /** 网站标题 */
  VITE_APP_TITLE: string;
  /**
   * 公共路径
   */
  VITE_BASE_URL: string;
  /**
   * 环境
   */
  VITE_ENV: string;
  /**
   * 请求超时时间
   */
  VITE_TIMEOUT: string;
  /**
   * 接口地址
   */
  VITE_API_DOMAIN: string;
  /**
   * 接口前缀
   */
  VITE_API_PREFIX: string;
  /**
   * 支持的多语言
   */
  VITE_LANGUAGES: PROJECT_LANGS[];
  /**
   * 默认语言
   */
  VITE_DEFAULT_LANGUAGE: PROJECT_LANGS;

  /**
   * Cookie Domain
   */
  VITE_COOKIE_DOMAIN: string;

  /**
   * Language Cookie Key
   */
  VITE_COOKIE_LANG_KEY: string;

  /**
   * 版本号
   */
  VITE___VERSION__: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
