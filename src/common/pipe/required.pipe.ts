import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class RequiredPipe implements PipeTransform<any> {
  constructor(private title?: string) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === null || value === undefined || value === "")
      throw new BadRequestException(`${this.title || metadata.data || "参数"}不能为空`);

    return value;
  }
}
