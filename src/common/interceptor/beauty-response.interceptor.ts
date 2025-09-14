import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";

import { DecoratorSymbol } from "@/constants";

@Injectable()
export class BeautyResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isOriginalResponse = this.reflector.get(
      DecoratorSymbol.ORIGINAL_RESPONSE,
      context.getHandler() ?? context.getClass()
    );

    if (isOriginalResponse) return next.handle();

    return next.handle().pipe(
      map(data => ({
        code: 200,
        data,
      }))
    );
  }
}
