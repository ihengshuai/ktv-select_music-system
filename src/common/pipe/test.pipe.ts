import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class RequiredId implements PipeTransform {
  // eslint-disable-next-line no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const id = typeof value === "object" ? value?.id : value;
    if (isNaN(parseInt(id))) {
      // 错误的客户端请求
      throw new HttpException("Id must be number", HttpStatus.BAD_REQUEST);
    }
    return parseInt(id);
  }
}
