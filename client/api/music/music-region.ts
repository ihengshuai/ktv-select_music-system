import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  IQueryMusicRegionDTO,
  IMusicRegionVO,
  ICreateMusicRegionDTO,
  IUpdateMusicRegionDTO,
} from "@/typings/models/music/music-region";

/**
 * 地区
 */
@Controller("/music-region")
export class MusicRegionController extends BaseController {
  /**
   * 获取地区列表
   */
  @Get()
  async getRegionList(query?: IListQuery<IQueryMusicRegionDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicRegionVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 创建地区
   */
  @Post()
  async createRegion(data: ICreateMusicRegionDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicRegionVO>({
      data,
      ...config,
    });
  }

  /**
   * 编辑地区
   */
  @Post("/update/{regionId}")
  async updateRegionStyle(regionId: number, data: IUpdateMusicRegionDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { regionId },
      data,
      ...config,
    });
  }

  /**
   * 删除地区
   */
  @Delete("/delete/{regionId}")
  async removeRegionStyle(regionId: number, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { regionId },
      ...config,
    });
  }
}
