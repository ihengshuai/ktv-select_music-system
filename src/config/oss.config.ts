import { ConfigType, registerAs } from "@nestjs/config";

import { ConfigDomainEnum, ConfigTokenEnum } from "@/constants";
import { env } from "@/utils/env";

export const OSS_CONFIG = {
  [ConfigTokenEnum.OSS_KEY]: env(ConfigTokenEnum.OSS_KEY),
  [ConfigTokenEnum.OSS_SECRET]: env(ConfigTokenEnum.OSS_SECRET),
  [ConfigTokenEnum.OSS_REGION]: env(ConfigTokenEnum.OSS_REGION),
  [ConfigTokenEnum.OSS_BUCKET]: env(ConfigTokenEnum.OSS_BUCKET),
  [ConfigTokenEnum.OSS_DOMAIN]: env(ConfigTokenEnum.OSS_DOMAIN),
};

export const OssConfig = registerAs(ConfigDomainEnum.OSS_CONFIG, () => OSS_CONFIG);

export type IOssConfig = ConfigType<typeof OssConfig>;
