import { applyDecorators, Render, SetMetadata } from "@nestjs/common";

import { DecoratorSymbol } from "@/constants";

/** 页面渲染 */
export const RenderPage = (path: string) => {
  // 多个装饰器
  return applyDecorators(SetMetadata(DecoratorSymbol.RENDER_PAGE_SYMBOL, true), Render(path));
};
