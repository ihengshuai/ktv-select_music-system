export class BaseResponseVO<T = unknown> {
  code: number = 200;
  message: string;
  data: T;

  constructor(code: number, data: T, message: string = "success") {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  getStatusCode() {
    return this.code;
  }
}
