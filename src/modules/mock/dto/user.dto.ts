import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

import { PaginationDTO } from "@/dto/base-pagination.dto";

/** 分页响应 */
export class PagerRes extends PaginationDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(val => parseInt(val.value || 0))
  @Type(() => Number)
  @IsNumber()
  readonly total: number = 0;
}

/** 列表结果 */
export class ListResultDto<T> {
  @ApiProperty({ required: true })
  items?: T[];

  @ApiProperty({ required: true, type: PagerRes })
  pager: PaginationDTO;
}

/** 用户模型 */
export class UserDto {
  @ApiProperty({ required: false, type: () => ["male", "remale"], enum: ["male", "remale"] })
  @IsOptional()
  @IsString()
  sex?: "male" | "remale";

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  age: number;
}

/** 用户列表查询类型 */
export class UsersQueryDto extends UserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ required: false, description: "出生日期范围" })
  @IsOptional()
  @IsString()
  birthRange: string;
}

/** 用户列表响应类型 */
export class UsersResponseDto extends ListResultDto<UserDto> {
  @ApiProperty({ type: UserDto, isArray: true })
  items: [];
}
