import { IsOptional, IsString } from "class-validator";

export class BaseQueryDTO {
  @IsOptional()
  @IsString()
  keywords?: string = "";
}
