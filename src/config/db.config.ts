import { ConfigType, registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

import { ConfigDomainEnum, ConfigTokenEnum } from "@/constants";
import { env, envNumber } from "@/utils/env";

export const DB_CONFIG: DataSourceOptions = {
  type: "mysql",
  host: env(ConfigTokenEnum.DB_HOST, "127.0.0.1"),
  port: envNumber(ConfigTokenEnum.DB_PORT, 3306),
  database: env(ConfigTokenEnum.DB_NAME, "test"),
  username: env(ConfigTokenEnum.DB_USER, "root"),
  password: env(ConfigTokenEnum.DB_PWD, "123456"),
  synchronize: true,
  logging: true,
  dateStrings: true,
  charset: "utf8mb4",
  timezone: "+08:00",
  entities: ["dist/server/modules/**/*.entity{.ts,.js}"],
  migrations: ["dist/server/migrations/*{.ts,.js}"],
  migrationsTableName: "table_migrations",
};

export const DbConfig = registerAs(ConfigDomainEnum.DB_CONFIG, () => DB_CONFIG);

export type IDbConfig = ConfigType<typeof DbConfig>;

const dataSource = new DataSource(DB_CONFIG);

export default dataSource;
