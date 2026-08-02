import { BaseResponseVO } from "./base-response.vo";

export class BaseModelResponseVO<T> extends BaseResponseVO<T> {
  constructor(code: number, data: T, message?: string) {
    super(code, data, message);
  }

  static success<T = any>(data: T) {
    return new BaseModelResponseVO<T>(200, data);
  }

  static error(code: number, errMessage: string) {
    return new BaseModelResponseVO(code, null, errMessage);
  }
}
