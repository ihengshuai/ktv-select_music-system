import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";

import { DECORATOR_SYMBOL } from "@/consts";
import { BaseResponseVO } from "@/vo/base-response.vo";

@Injectable()
export class BeautyResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isWrapperResponse = this.reflector.get(
      DECORATOR_SYMBOL.WRAPPER_RESPONSE,
      context.getHandler() ?? context.getClass()
    );

    if (isWrapperResponse === false) return next.handle();

    return next.handle().pipe(
      map(data => {
        if (data instanceof BaseResponseVO) return data;

        return {
          code: 200,
          data,
        };
      })
    );
  }
}
