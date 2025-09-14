import { Method } from "axios";

import { IConstructor } from "@/typings/common/type";

export function Controller(path = "") {
  return function (target: IConstructor) {
    return class extends target {
      urlPrefix = path;

      protected get isController() {
        return true;
      }

      constructor(...args: any[]) {
        super(...args);
      }
    } as typeof target;
  };
}

function MethodDecorator(path = "", method: Method) {
  return function (target: InstanceType<IConstructor>, propertyKey: string, descriptor: PropertyDescriptor) {
    const uniqueKey = `${target.constructor.name}_${propertyKey}_${path}_${method}`;

    const originalMethod = descriptor.value;

    if (!target.activeRequestMaps) target.activeRequestMaps = {};

    target.activeRequestMaps[uniqueKey] = {
      path: !path ? "" : path.startsWith("/") ? path : `/${path}`,
      method,
    };

    descriptor.value = function (...args: any[]) {
      target.activeRequest = uniqueKey;
      return originalMethod.apply(this, args);
    };
  };
}

export const Get = (path = "") => MethodDecorator(path, "GET");
export const Post = (path = "") => MethodDecorator(path, "POST");
export const Put = (path = "") => MethodDecorator(path, "PUT");
export const Delete = (path = "") => MethodDecorator(path, "DELETE");
export const Patch = (path = "") => MethodDecorator(path, "PATCH");
export const Head = (path = "") => MethodDecorator(path, "HEAD");
export const Options = (path = "") => MethodDecorator(path, "OPTIONS");
