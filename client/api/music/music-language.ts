import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Delete, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import type {
  IQueryMusicLanguageDTO,
  IMusicLanguageVO,
  ICreateMusicLanguageDTO,
  IUpdateMusicLanguageDTO,
} from "@/typings/models/music/music-language";

/**
 * 语种
 */
@Controller("/music-language")
export class MusicLanguageController extends BaseController {
  /**
   * 获取语种列表
   */
  @Get()
  async getLanguageList(query?: IListQuery<IQueryMusicLanguageDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicLanguageVO>>({
      params: query,
      ...config,
    });
  }

  /**
   * 创建语种
   */
  @Post()
  async createMusicLanguage(data: ICreateMusicLanguageDTO, config?: IHttpRequestConfig) {
    return this.send<IMusicLanguageVO>({
      data,
      ...config,
    });
  }

  /**
   * 编辑语种
   */
  @Post("/update/{languageId}")
  async updateMusicLanguage(languageId: number, data: IUpdateMusicLanguageDTO, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { languageId },
      data,
      ...config,
    });
  }

  /**
   * 删除语种
   */
  @Delete("/delete/{languageId}")
  async removeMusicLanguage(languageId: number, config?: IHttpRequestConfig) {
    return this.send<boolean>({
      urlPath: { languageId },
      ...config,
    });
  }
}
