import { ConfigType, registerAs } from "@nestjs/config";

import { CONFIG_DOMAIN_ENUM, CONFIG_TOKEN_ENUM } from "@/consts";
import { env } from "@/utils/env";

export const OSS_CONFIG = {
  [CONFIG_TOKEN_ENUM.OSS_KEY]: env(CONFIG_TOKEN_ENUM.OSS_KEY),
  [CONFIG_TOKEN_ENUM.OSS_SECRET]: env(CONFIG_TOKEN_ENUM.OSS_SECRET),
  [CONFIG_TOKEN_ENUM.OSS_REGION]: env(CONFIG_TOKEN_ENUM.OSS_REGION),
  [CONFIG_TOKEN_ENUM.OSS_BUCKET]: env(CONFIG_TOKEN_ENUM.OSS_BUCKET),
  [CONFIG_TOKEN_ENUM.OSS_DOMAIN]: env(CONFIG_TOKEN_ENUM.OSS_DOMAIN),
};

export const OssConfig = registerAs(CONFIG_DOMAIN_ENUM.OSS_CONFIG, () => OSS_CONFIG);

export type IOssConfig = ConfigType<typeof OssConfig>;
