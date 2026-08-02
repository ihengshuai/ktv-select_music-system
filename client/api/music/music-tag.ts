import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  IQueryMusicTagDTO,
  IMusicTagVO,
  ICreateMusicTagDTO,
  IUpdateMusicTagDTO,
} from "@/typings/models/music/music-tag";

/**
 * 标签
 */
@Controller("/music-tag")
export class MusicTagController extends BaseController {
  /**
   * 获取标签列表
   */
  @Get()
  async getTagList(query?: IListQuery<IQueryMusicTagDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicTagVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 创建标签
   */
  @Post()
  async createTag(data: ICreateMusicTagDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicTagVO>({
      data,
      ...config,
    });
  }

  /**
   * 编辑标签
   */
  @Post("/update/{tagId}")
  async updateMusicTag(tagId: number, data: IUpdateMusicTagDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { tagId },
      data,
      ...config,
    });
  }

  /**
   * 删除标签
   */
  @Delete("/delete/{tagId}")
  async removeMusicTag(tagId: number, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { tagId },
      ...config,
    });
  }
}
