import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserLoginDTO {
  @ApiProperty({ description: "账号" })
  @IsString({ message: "账号不能为空" })
  username: string;

  @ApiProperty({ description: "密码" })
  @IsString({ message: "密码不能为空" })
  password: string;

  @ApiProperty({ description: "验证码" })
  @IsString({ message: "验证码不能为空" })
  code: string;
}

export class OrderLoginDTO {
  @ApiProperty({ description: "订单号" })
  @IsString({ message: "订单号不能为空" })
  orderNo: string;

  @ApiProperty({ description: "密码" })
  @IsString({ message: "密码不能为空" })
  password: string;
}
