import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDTO {
  @ApiProperty({ description: "页码", example: 1, required: false })
  @IsOptional()
  @Transform(v => v.value >> 0 || 1)
  @IsNumber()
  @Min(1)
  readonly page?: number = 1;

  @ApiProperty({ description: "每页数量", example: 10, required: false })
  @IsOptional()
  @Transform(v => v.value >> 0 || 10)
  @IsNumber()
  @Min(1)
  readonly size?: number = 10;

  total?: number = 0;
}
