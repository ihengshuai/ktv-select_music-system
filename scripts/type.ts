export interface EnvConfig {
  VITE_BASE_URL: string;
  VITE_API_DOMAIN: string;
  VITE_TIMEOUT: string;
  VITE_USE_MOCK: string;
  VITE_MOCK_API: string;
  VERSION: string;
  APP_TITLE: string;
  API_PREFIX: string;
  APP_ID: string;
  LANGUAGES: string;
  DEFAULT_LANGUAGE: string;
  COOKIE_LANG_KEY: string;
  COOKIE_DOMAIN: string;
  NODE_ENV: "development" | "production";
  DROP_CONSOLE: string;
  PORT: string;
  CLIENT_OUTDIR: string;
  BUNDLE_ANALYZER?: boolean;
  SSL_CERTIFICATE_KEY?: string;
  SSL_CERTIFICATE?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_NAME?: string;
  DB_USER?: string;
  DB_PWD?: string;
  __isDev__?: boolean;
}
