import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

import { APP_CONFIG } from "@/config";

const { APP_ID } = APP_CONFIG;

export class FileSystemDTO {
  /** 应用ID */
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value && value.replaceAll("/", "-"))
  appId: string = APP_ID || "default-app";
}
