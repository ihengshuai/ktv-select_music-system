/** 不同领域配置标识 */
export enum CONFIG_DOMAIN_ENUM {
  /** 应用通用配置 */
  APP_CONFIG = "APP_CONFIG",
  /** 数据库通用配置 */
  DB_CONFIG = "DB_CONFIG",
  /** 文件系统通用配置 */
  OSS_CONFIG = "OSS_CONFIG",
  FILE_CONFIG = "FILE_CONFIG",
}

/** 所有配置字段 */
export enum CONFIG_TOKEN_ENUM {
  // ========== APP 配置  ==========
  /** 是否生产环境 */
  IS_PROD = "__is_Prod__",
  /** 是否开发环境 */
  IS_DEV = "__is_Dev__",
  /** 是否使用HTTPS */
  IS_HTTPS = "__isHttps__",
  NODE_ENV = "NODE_ENV",
  PORT = "PORT",
  /** HMR 端口 */
  HMR_PORT = "HMR_PORT",
  API_PREFIX = "API_PREFIX",
  /** Cookie存储domain  */
  COOKIE_DOMAIN = "COOKIE_DOMAIN",
  /** 多语言COOKIE KEY */
  COOKIE_LANG_KEY = "COOKIE_LANG_KEY",
  /** 默认语言 */
  DEFAULT_LANGUAGE = "DEFAULT_LANGUAGE",
  /** 应用ID */
  APP_ID = "APP_ID",
  /** app 名字 */
  APP_TITLE = "APP_TITLE",
  /** TOKEN COOKIE KEY */
  TOKEN_COOKIE = "TOKEN_COOKIE",
  /** TOKEN 密钥 */
  TOKEN_SECRET = "TOKEN_SECRET",
  /** 客户端打包路径 */
  CLIENT_OUTDIR = "CLIENT_OUTDIR",
  SSL_CERTIFICATE = "SSL_CERTIFICATE",
  SSL_CERTIFICATE_KEY = "SSL_CERTIFICATE_KEY",
  DB_ENABLE = "DB_ENABLE",
  /** TTL 限制 */
  TTL_TIME = "TTL_TIME",
  TTL_LIMIT = "TTL_LIMIT",
  /** 签名忽略 */
  SIGNATURE_IGNORE = "SIGNATURE_IGNORE",

  // ========== 数据库 配置  ==========
  DB_HOST = "DB_HOST",
  DB_PORT = "DB_PORT",
  DB_NAME = "DB_NAME",
  DB_USER = "DB_USER",
  DB_PWD = "DB_PWD",

  // ========== 本地文件系统 配置  ==========
  FILE_UPLOAD_PATH = "FILE_UPLOAD_PATH",

  // ========== OSS 配置  ==========
  OSS_KEY = "OSS_KEY",
  OSS_SECRET = "OSS_SECRET",
  OSS_REGION = "OSS_REGION",
  OSS_BUCKET = "OSS_BUCKET",
  OSS_DOMAIN = "OSS_DOMAIN",

  // ========== 用户 配置  ==========
  HAVE_ROOT = "HAVE_ROOT",
}
