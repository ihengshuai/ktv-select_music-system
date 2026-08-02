import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  ICreateEnumCodeDTO,
  IEnumCodeVO,
  IQueryEnumCodeDTO,
  IUpdateEnumCodeDTO,
} from "@/typings/models/enum-code/enum-code";

/**
 * 枚举编码
 */
@Controller("/enum-code")
export class EnumCodeController extends BaseController {
  /**
   * 获取枚举编码列表
   */
  @Get()
  async getEnumCodeList(params?: IListQuery<IQueryEnumCodeDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IEnumCodeVO>>({
      params,
      ...config,
    });
  }

  /**
   * 获取枚举详情
   */
  @Get("detail")
  async getEnumCodeDetail(params?: IQueryEnumCodeDTO, config?: IHttpRequestConfig) {
    return this.send<IEnumCodeVO>({
      params,
      ...config,
    });
  }

  /**
   * 创建枚举编码
   */
  @Post()
  async createEnumCode(data: ICreateEnumCodeDTO, config?: IHttpRequestConfig) {
    return this.send<IEnumCodeVO>({
      data,
      ...config,
    });
  }

  /**
   * 更新枚举
   */
  @Post("update/{code}")
  async updateEnumCode(code: string, data: IUpdateEnumCodeDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { code },
      data,
      ...config,
    });
  }

  /**
   * 删除枚举
   */
  @Delete("{code}")
  async deleteEnumCode(code: string, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { code },
      ...config,
    });
  }
}
