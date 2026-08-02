import { MUSIC_STATUS } from "@/constants/music";
import { BaseController } from "@/helper/request/constructor/base-controller";
import { Controller, Get, Post } from "@/helper/request/controller/http-controller";
import type { IHttpRequestConfig } from "@/typings/common/http";
import type { IListQuery, IListResult } from "@/typings/common/table";
import { IQueryMusicDTO, IMusicVO } from "@/typings/models/music/music";
import { IOrderVO } from "@/typings/models/order/order";

@Controller()
export class ClientController extends BaseController {
  /**
   * 获取歌曲列表
   */
  @Get("/music")
  async getMusicList(query?: IListQuery<IQueryMusicDTO>, config?: IHttpRequestConfig) {
    return this.send<IListResult<IMusicVO>>({
      params: {
        ...query,
        status: MUSIC_STATUS.ENABLED,
      },
      ...config,
    });
  }

  @Post("/auth/order-login")
  async toLogin(data: any) {
    return this.send<IOrderVO>({
      data,
    });
  }
}
