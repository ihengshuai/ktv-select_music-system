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

import { QueryMusicRegionDTO, CreateMusicRegionDTO, UpdateMusicRegionDTO } from "./dto/music-region.dto";
import { MusicRegionService } from "./music-region.service";
import { MusicRegionVO } from "./vo/music-region.vo";

@ApiTags("歌曲地区管理")
@Controller("music-region")
export class MusicRegionController {
  constructor(private readonly musicRegionService: MusicRegionService) {}

  /**
   * 获取歌曲地区列表
   */
  @ApiOperation({ summary: "获取歌曲地区列表" })
  @ApiListResponse(MusicRegionVO)
  @Get()
  async getSongRegionList(@Query() query: QueryMusicRegionDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.musicRegionService.getMusicRegionList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌曲地区
   */
  @ApiOperation({ summary: "新增歌曲地区" })
  @ApiModelResponse(MusicRegionVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post()
  async createSongRegion(@Body() createMusicRegionDTO: CreateMusicRegionDTO) {
    const res = await this.musicRegionService.createMusicRegion(createMusicRegionDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 修改歌曲地区
   */
  @ApiOperation({ summary: "修改歌曲地区" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSongRegion(@Param("id") regionId: number, @Body() updateMusicRegionDTO: UpdateMusicRegionDTO) {
    const res = await this.musicRegionService.updateMusicRegion(regionId, updateMusicRegionDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌曲地区
   */
  @ApiOperation({ summary: "删除歌曲地区" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSongRegion(@Param("id") regionId: number) {
    const res = await this.musicRegionService.removeMusicRegion(regionId);

    return BaseModelResponseVO.success(res);
  }
}
