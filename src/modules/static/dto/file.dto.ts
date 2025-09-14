import { IsEnum, IsOptional, IsString } from "class-validator";

import { FileType } from "@/constants";
import { FileSystemDTO } from "@/shared/file-system/dto/file-system.dto";

class FileBaseDTO extends FileSystemDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsEnum(FileType)
  type: FileType;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  uid?: string;
}

export class CreateFileDTO extends FileBaseDTO {}

export class UpdateFileDTO extends FileBaseDTO {}

export class SaveFileDTO extends CreateFileDTO {
  @IsString()
  url: string;
}
