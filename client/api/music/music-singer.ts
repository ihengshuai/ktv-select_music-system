import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  ICreateMusicSingerDTO,
  IMusicSingerVO,
  IQueryMusicSingerDTO,
  IUpdateMusicSingerDTO,
} from "@/typings/models/music/music-singer";

/**
 * 歌手
 */
@Controller("/music-singer")
export class MusicSingerController extends BaseController {
  /**
   * 获取歌手列表
   */
  @Get()
  async getSingerList(query?: IListQuery<IQueryMusicSingerDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicSingerVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 创建歌手
   */
  @Post()
  async createSinger(data: ICreateMusicSingerDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicSingerVO>({
      data,
      ...config,
    });
  }

  /**
   * 编辑歌手
   */
  @Post("/update/{singerId}")
  async updateSinger(singerId: number, data: IUpdateMusicSingerDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { singerId },
      data,
      ...config,
    });
  }

  /**
   * 删除歌手
   */
  @Delete("/delete/{singerId}")
  async removeSinger(singerId: number, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { singerId },
      ...config,
    });
  }
}
