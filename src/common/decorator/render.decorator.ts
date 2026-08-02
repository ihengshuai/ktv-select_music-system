import { applyDecorators, Render, SetMetadata } from "@nestjs/common";

import { DECORATOR_SYMBOL } from "@/consts";

/** 页面渲染 */
export const RenderPage = (path: string) => {
  // 多个装饰器
  return applyDecorators(
    SetMetadata(DECORATOR_SYMBOL.RENDER_PAGE_SYMBOL, true),
    SetMetadata(DECORATOR_SYMBOL.WRAPPER_RESPONSE, false),
    Render(path)
  );
};
