import { MinLength, IsString, MaxLength, IsOptional, IsNumber } from "class-validator";

export class UpdateNicknameDTO {
  @IsString({ message: "昵称不能为空" })
  @MinLength(2)
  @MaxLength(10)
  nickname: string;

  @IsOptional()
  @IsNumber()
  avatar: number;
}
