import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { Role } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { QueryMusicSingerDTO, CreateMusicSingerDTO, UpdateMusicSingerDTO } from "./dto/music-singer.dto";
import { MusicSingerService } from "./music-singer.service";
import { MusicSingerVO } from "./vo/music-singer.vo";

@ApiTags("歌手管理")
@Controller("music-singer")
export class MusicSingerController {
  constructor(private readonly singerService: MusicSingerService) {}

  /**
   * 获取歌手列表
   */
  @ApiOperation({ summary: "查询歌手列表" })
  @ApiListResponse(MusicSingerVO)
  @Get()
  async getSingerList(@Query() query: QueryMusicSingerDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.singerService.getSingerList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌手
   */
  @ApiOperation({ summary: "新增歌手" })
  @ApiModelResponse(MusicSingerVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post()
  async createSinger(@Body() createSingerDTO: CreateMusicSingerDTO) {
    const res = await this.singerService.createSinger(createSingerDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 修改歌手
   */
  @ApiOperation({ summary: "修改歌手" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSinger(@Param("id") singerId: number, @Body() updateSingerDTO: UpdateMusicSingerDTO) {
    const res = await this.singerService.updateSinger(singerId, updateSingerDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌手
   */
  @ApiOperation({ summary: "删除歌手" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSinger(@Param("id") singerId: number) {
    const res = await this.singerService.removeSinger(singerId);

    return BaseModelResponseVO.success(res);
  }
}
