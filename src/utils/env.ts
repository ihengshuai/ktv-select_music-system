import dotenv from "dotenv";

export const NODE_ENV = env("NODE_ENV", "development");

dotenv.config({ path: [".env", `.env.${NODE_ENV}`], override: true });

export type BaseType = boolean | number | string | undefined | null;

export function formatEnv<T extends BaseType = string>(
  key: string,
  defaultValue: T = null,
  cb?: (...args: any[]) => any
): T {
  const value = (process.env[key] ?? defaultValue) as unknown as T;

  if (cb) return cb(value);
  return value;
}

export function env(key: string, defaultValue = null) {
  return formatEnv<string>(key, defaultValue);
}

export function envNumber(key: string, defaultValue = null) {
  return formatEnv<number>(key, defaultValue, v => Number(v));
}

export function envBoolean(key: string, defaultValue = null) {
  return formatEnv<boolean>(key, defaultValue, v => v === "true" || v === true);
}
