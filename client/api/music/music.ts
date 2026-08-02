import { YoN } from "@/constants/common";
import { MUSIC_STATUS } from "@/constants/music";
import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type { IMusicCreateDTO, IMusicUpdateDTO, IMusicVO, IQueryMusicDTO } from "@/typings/models/music/music";

/**
 * 音乐管理
 */
@Controller("/music")
export class MusicController extends BaseController {
  /**
   * 获取歌曲列表
   */
  @Get()
  async getMusicList(query?: IListQuery<IQueryMusicDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 新增歌曲
   */
  @Post()
  async createMusic(data: IMusicCreateDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicVO>({
      data,
      ...config,
    });
  }

  /**
   * 获取歌曲详情
   */
  @Get("/detail/{songId}")
  async getMusicDetail(songId: string, config?: IHttpRequestConfig) {
    return this.send<IMusicVO>({
      urlPath: { songId },
      ...config,
    });
  }

  /**
   * 编辑歌曲
   */
  @Post("/update/{songId}")
  async updateMusic(songId: string, data: IMusicUpdateDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { songId },
      data,
      ...config,
    });
  }

  /**
   * 删除歌曲
   */
  @Delete("/delete/{songId}")
  async removeMusic(songId: string, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { songId },
      ...config,
    });
  }

  /**
   * 上下架歌曲
   */
  @Post("/status/{songId}")
  async updateMusicStatus(songId: string, status: MUSIC_STATUS, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { songId },
      data: {
        status,
      },
      ...config,
    });
  }

  /**
   * 推荐/取消推荐歌曲
   */
  @Post("/recommend/{songId}")
  async updateMusicRecommend(songId: string, recommend: YoN, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { songId },
      data: {
        recommend,
      },
      ...config,
    });
  }
}
