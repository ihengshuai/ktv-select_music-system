import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Get } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";

@Controller("/user")
export class TestController extends BaseController {
  /** 测试请求 */
  @Get("/users")
  testRequest(config?: IHttpRequestConfig) {
    return this.send<{ message: string }>({
      ...config,
    });
  }

  /** 测试请求 */
  @Get("")
  testGetUser(username: string, config?: IHttpRequestConfig) {
    return this.send<{ message: string }>({
      params: { username },
      ...config,
    });
  }
}
