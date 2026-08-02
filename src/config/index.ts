import { CONFIG_DOMAIN_ENUM } from "@/consts";
import { RecordNamePaths } from "@/typings/global";

import { AppConfig, IAppConfig } from "./app.config";
import { DbConfig, IDbConfig } from "./db.config";
import { FileConfig, IFileConfig } from "./file.config";
import { IOssConfig, OssConfig } from "./oss.config";

export * from "./app.config";
export * from "./db.config";

const config = {
  [CONFIG_DOMAIN_ENUM.APP_CONFIG]: AppConfig,
  [CONFIG_DOMAIN_ENUM.DB_CONFIG]: DbConfig,
  [CONFIG_DOMAIN_ENUM.FILE_CONFIG]: FileConfig,
  [CONFIG_DOMAIN_ENUM.OSS_CONFIG]: OssConfig,
};

interface IConfigAll {
  [CONFIG_DOMAIN_ENUM.APP_CONFIG]: IAppConfig;
  [CONFIG_DOMAIN_ENUM.DB_CONFIG]: IDbConfig;
  [CONFIG_DOMAIN_ENUM.FILE_CONFIG]: IFileConfig;
  [CONFIG_DOMAIN_ENUM.OSS_CONFIG]: IOssConfig;
}

export type IConfig = RecordNamePaths<IConfigAll>;

export default config;
