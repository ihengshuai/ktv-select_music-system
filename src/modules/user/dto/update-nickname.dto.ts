import { ApiProperty } from "@nestjs/swagger";
import { MinLength, IsString, MaxLength, IsOptional, IsNumber } from "class-validator";

export class UpdateNicknameDTO {
  @ApiProperty({ description: "昵称", minimum: 2, maximum: 10 })
  @IsString({ message: "昵称不能为空" })
  @MinLength(2)
  @MaxLength(10)
  nickname: string;

  @ApiProperty({ description: "头像", required: false })
  @IsOptional()
  @IsNumber()
  avatar: number;
}
