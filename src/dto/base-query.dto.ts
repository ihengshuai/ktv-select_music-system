import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BaseQueryDTO {
  @ApiProperty({
    description: "搜索关键字",
    required: false,
  })
  @IsOptional()
  @IsString()
  keywords?: string = "";
}
