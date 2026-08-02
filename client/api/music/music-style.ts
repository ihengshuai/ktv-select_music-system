import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  ICreateMusicStyleDTO,
  IMusicStyleVO,
  IQueryMusicStyleDTO,
  IUpdateMusicStyleDTO,
} from "@/typings/models/music/music-style";

/**
 * 风格
 */
@Controller("/music-style")
export class MusicStyleController extends BaseController {
  /**
   * 获取风格列表
   */
  @Get()
  async getStyleList(query?: IListQuery<IQueryMusicStyleDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicStyleVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 创建风格
   */
  @Post()
  async createStyle(data: ICreateMusicStyleDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicStyleVO>({
      data,
      ...config,
    });
  }

  /**
   * 编辑风格
   */
  @Post("/update/{styleId}")
  async updateMusicStyle(styleId: number, data: IUpdateMusicStyleDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { styleId },
      data,
      ...config,
    });
  }

  /**
   * 删除风格
   */
  @Delete("/delete/{styleId}")
  async removeMusicStyle(styleId: number, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { styleId },
      ...config,
    });
  }
}
