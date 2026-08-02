import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { FILE_LOCATION, FILE_TYPE } from "@/consts";
import { BaseQueryDTO } from "@/dto/base-query.dto";
import { FileSystemDTO } from "@/shared/file-system/dto/file-system.dto";

class FileBaseDTO extends FileSystemDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsEnum(FILE_TYPE, { message: "文件类型错误(type)" })
  type: FILE_TYPE;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  uid?: string;
}

export class CreateFileDTO extends FileBaseDTO {}

export class UpdateFileDTO extends FileBaseDTO {}

export class SaveFileDTO extends CreateFileDTO {
  @ApiProperty({ description: "文件地址" })
  @IsString()
  url: string;

  @ApiProperty({ description: "文件位置", enum: FILE_LOCATION })
  @IsEnum(FILE_LOCATION, { message: "文件位置错误(location)" })
  location: FILE_LOCATION;
}

/** 查询文件 */
export class QueryFileDTO extends BaseQueryDTO {
  @ApiProperty({ description: "文件类型", enum: FILE_TYPE, required: false })
  @IsOptional()
  @IsEnum(FILE_TYPE, { message: "文件类型" })
  type: FILE_TYPE;

  @ApiProperty({ description: "文件位置", enum: FILE_LOCATION, required: false })
  @IsOptional()
  @IsEnum(FILE_LOCATION, { message: "文件位置" })
  location: FILE_LOCATION;
}
