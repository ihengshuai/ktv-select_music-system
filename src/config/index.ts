import { ConfigDomainEnum } from "@/constants";
import { RecordNamePaths } from "@/typings/global";

import { AppConfig, IAppConfig } from "./app.config";
import { DbConfig, IDbConfig } from "./db.config";
import { IOssConfig, OssConfig } from "./oss.config";

export * from "./app.config";
export * from "./db.config";

const config = {
  [ConfigDomainEnum.APP_CONFIG]: AppConfig,
  [ConfigDomainEnum.DB_CONFIG]: DbConfig,
  [ConfigDomainEnum.OSS_CONFIG]: OssConfig,
};

interface IConfigAll {
  [ConfigDomainEnum.APP_CONFIG]: IAppConfig;
  [ConfigDomainEnum.DB_CONFIG]: IDbConfig;
  [ConfigDomainEnum.OSS_CONFIG]: IOssConfig;
}

export type IConfig = RecordNamePaths<IConfigAll>;

export default config;
