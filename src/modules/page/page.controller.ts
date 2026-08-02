import { Controller, Get, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { I18n, I18nContext } from "nestjs-i18n";

import { HttpSignature, RenderPage, Token } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { TryTakeTokenInterceptor } from "@/common/interceptor/try-take-token.interceptor";
import { IAppConfig, IConfig } from "@/config";
import type { IToken } from "@/typings/application";
import { ModelAndView } from "@/vo/model-and-view.vo";

/**
 * 模板引擎渲染
 * @docs https://ejs.co/
 */
@HttpSignature(false) /* 必须标识禁用签名 */
@Controller("/page")
export class PageController {
  private readonly appConfig = this.config.get<IAppConfig>("APP_CONFIG");

  constructor(readonly config: ConfigService<IConfig>) {}

  @Get("/exception")
  @RenderPage("exception/index")
  renderHome(@I18n() i18n: I18nContext) {
    const title = i18n.t("common.title");

    console.log(title);

    // 模板中可以直接拿到 <%=title %>
    // 获取使用json对象 -> const ctxData = JSON.parse(JSON.stringify(<%- data %>))
    // ctxData.title, ctxData.code, ctxData.message
    return new ModelAndView({ title, code: 500, message: "服务器异常" });
  }

  @Get("/login")
  @RenderPage("login")
  @UseInterceptors(TryTakeTokenInterceptor)
  renderLoginPage(@Token() token: IToken): ModelAndView {
    const { API_PREFIX } = this.appConfig;

    if (token) {
      delete token.expire;
      return new ModelAndView({ title: "登录测试(你已登录)", API_PREFIX, isLogin: true, userInfo: token });
    }

    return new ModelAndView({ title: "登录测试", API_PREFIX, isLogin: false });
  }

  @Get("/register")
  @RenderPage("register")
  renderRegisterPage(): ModelAndView {
    const { API_PREFIX } = this.appConfig;

    return new ModelAndView({ title: "注册测试", API_PREFIX });
  }

  @UseGuards(AuthenticationBaseGuard)
  @RenderPage("sse")
  @Get("/sse")
  renderSsePage() {
    const { API_PREFIX } = this.appConfig;

    return new ModelAndView({ title: "测试SSE页面", API_PREFIX });
  }

  @UseGuards(AuthenticationBaseGuard)
  @RenderPage("upload")
  @Get("/upload")
  renderUploadPage() {
    const { API_PREFIX } = this.appConfig;

    return new ModelAndView({ title: "测试文件上传", API_PREFIX: `${API_PREFIX}/testing/testing-file` });
  }

  @UseGuards(AuthenticationBaseGuard)
  @RenderPage("download")
  @Get("/download")
  renderDownloadPage() {
    const { API_PREFIX } = this.appConfig;

    return new ModelAndView({ title: "测试文件下载", API_PREFIX: `${API_PREFIX}/testing/testing-file` });
  }
}
