import { AxiosError } from "axios";

export abstract class Exception extends Error {
  stack: any;
  timestamp: number;

  constructor(message: string, stack: any) {
    super(message);

    this.stack = stack;
    this.timestamp = Date.now();
  }
}

export class RuntimeException extends Exception {
  name: string;

  constructor(message: string, stack: any) {
    super(message, stack);

    this.name = "RuntimeException";
  }
}

export class HttpException extends Exception {
  status: number;
  stack: AxiosError<any>;

  constructor(message: string, status: number, stack: AxiosError<any>) {
    super(message, null);

    this.status = status;
    this.stack = stack;

    this.name = "HttpException";
  }
}

export class HttpBusinessException extends HttpException {
  code: number;

  constructor(message: string, code: number, stack: AxiosError<any>) {
    super(message, 200, stack);

    this.code = code;
    this.name = "HttpBusinessException";
  }
}

export class BusinessValidationException extends Exception {
  constructor(message: string, stack?: any) {
    super(message, stack);

    this.name = "BusinessValidationException";
  }
}
