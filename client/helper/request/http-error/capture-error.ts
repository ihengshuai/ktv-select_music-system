import { message } from "ant-design-vue";

import { IConstructor } from "@/typings/common/type";

export class HttpError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }

  notice() {
    this.message && message.error(this.message);
  }
}

export function CaptureError(ErrorClass: IConstructor<HttpError>) {
  return function (target: InstanceType<IConstructor>, propertyKey: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originMethod.apply(this, args);
      } catch (error) {
        const httpError = new ErrorClass(error);

        httpError.notice();

        throw httpError;
      }
    };
  };
}
