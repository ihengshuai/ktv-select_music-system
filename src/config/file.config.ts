import { ConfigType, registerAs } from "@nestjs/config";

import { CONFIG_DOMAIN_ENUM, CONFIG_TOKEN_ENUM } from "@/consts";
import { env } from "@/utils/env";

// 本地文件上传配置
export const FILE_CONFIG = {
  [CONFIG_TOKEN_ENUM.FILE_UPLOAD_PATH]: env(CONFIG_TOKEN_ENUM.FILE_UPLOAD_PATH, "./.upload"),
};

export const FileConfig = registerAs(CONFIG_DOMAIN_ENUM.FILE_CONFIG, () => FILE_CONFIG);

export type IFileConfig = ConfigType<typeof FileConfig>;
