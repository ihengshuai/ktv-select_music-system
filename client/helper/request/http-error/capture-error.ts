import { message } from "ant-design-vue";

import { HttpBusinessException } from "@/helper/exception";
import { IConstructor } from "@/typings/common/type";

export abstract class HttpBusinessExceptionMsg extends HttpBusinessException {
  showExceptionMsg: boolean;

  readonly exception: HttpBusinessException;

  constructor(exception: HttpBusinessException) {
    super(exception.message, exception.code, exception.stack);

    this.exception = exception;
    // @ts-expect-error
    this.exception.message = this.msg || exception.message;
  }

  abstract get msg(): string | null;

  notice() {
    if (this.showExceptionMsg) {
      this.msg && message.error(this.msg);
    }
  }
}

export function CaptureHttpExceptionMsg(ErrorClass: IConstructor<HttpBusinessExceptionMsg>) {
  return function (target: InstanceType<IConstructor>, propertyKey: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originMethod.apply(this, args);
      } catch (error) {
        const httpError = new ErrorClass(error);

        httpError.notice();

        throw httpError.exception;
      }
    };
  };
}
