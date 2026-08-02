import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidateEnumPipe implements PipeTransform<any> {
  constructor(public key?: string) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined || value === "")
      throw new BadRequestException(`${metadata.data || "参数"}不能为空`);

    if (!Object.values(metadata.metatype).includes(value))
      throw new BadRequestException(`${metadata.data || "参数"}格式错误`);

    return value;
  }
}
