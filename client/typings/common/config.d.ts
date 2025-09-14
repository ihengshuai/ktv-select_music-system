import { PROJECT_LANGS } from "@/constants/common";

/**
 * 项目配置文件
 */
export interface IConfig {
  /** 标题 */
  APP_TITLE: string;
  /**
   * 公共路径
   */
  PUBLIC_PATH: string;
  /**
   * 环境
   */
  ENV: "development" | "production";
  /**
   * 版本号
   */
  __VERSION__: string;
  /**
   * 开发环境
   */
  __isDev__: boolean;
  /**
   * 生产环境
   */
  __isProd__: boolean;
  /**
   * 请求超时时间
   */
  TIMEOUT: number;
  /**
   * 接口地址
   */
  API_DOMAIN: string;
  /**
   * 接口前缀
   */
  API_PREFIX: string;
  /**
   * 支持的多语言
   */
  LANGUAGES: PROJECT_LANGS[];
  /**
   * 默认语言
   */
  DEFAULT_LANGUAGE: PROJECT_LANGS;

  /**
   * Cookie Domain
   */
  COOKIE_DOMAIN: string;

  /**
   * Language Cookie Key
   */
  COOKIE_LANG_KEY: string;

  /** 应用ID */
  APP_ID: string;
}
