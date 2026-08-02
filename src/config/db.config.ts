import { ConfigType, registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

import { CONFIG_DOMAIN_ENUM, CONFIG_TOKEN_ENUM } from "@/consts";
import { env, envNumber } from "@/utils/env";

export const DB_CONFIG: DataSourceOptions = {
  type: "mysql",
  host: env(CONFIG_TOKEN_ENUM.DB_HOST, "127.0.0.1"),
  port: envNumber(CONFIG_TOKEN_ENUM.DB_PORT, 3306),
  database: env(CONFIG_TOKEN_ENUM.DB_NAME, "test"),
  username: env(CONFIG_TOKEN_ENUM.DB_USER, "root"),
  password: env(CONFIG_TOKEN_ENUM.DB_PWD, "123456"),
  synchronize: true,
  logging: false,
  dateStrings: true,
  charset: "utf8mb4",
  timezone: "+08:00",
  entities: ["dist/server/modules/**/*.entity{.ts,.js}"],
  migrations: ["dist/server/migrations/*{.ts,.js}"],
  migrationsTableName: "table_migrations",
};

export const DbConfig = registerAs(CONFIG_DOMAIN_ENUM.DB_CONFIG, () => DB_CONFIG);

export type IDbConfig = ConfigType<typeof DbConfig>;

const dataSource = new DataSource(DB_CONFIG);

export default dataSource;
