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

import { QueryMusicStyleDTO, CreateMusicStyleDTO, UpdateMusicStyleDTO } from "./dto/music-style.dto";
import { MusicStyleService } from "./music-style.service";
import { MusicStyleVO } from "./vo/music-style.vo";

@ApiTags("歌曲风格管理")
@Controller("music-style")
export class MusicStyleController {
  constructor(private readonly musicStyleService: MusicStyleService) {}

  /**
   * 获取歌曲风格列表
   */
  @ApiOperation({ summary: "歌曲风格列表" })
  @ApiListResponse(MusicStyleVO)
  @Get()
  async getSongStyleList(@Query() query: QueryMusicStyleDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.musicStyleService.getMusicStyleList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌曲风格
   */
  @ApiOperation({ summary: "新增风格" })
  @ApiModelResponse(MusicStyleVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post()
  async createSongStyle(@Body() createMusicStyleDTO: CreateMusicStyleDTO) {
    const res = await this.musicStyleService.createMusicStyle(createMusicStyleDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 修改歌曲风格
   */
  @ApiOperation({ summary: "修改歌曲风格" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSongStyle(@Param("id") styleId: number, @Body() updateMusicStyleDTO: UpdateMusicStyleDTO) {
    const res = await this.musicStyleService.updateMusicStyle(styleId, updateMusicStyleDTO);
    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌曲风格
   */
  @ApiOperation({ summary: "删除歌曲风格" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSongStyle(@Param("id") styleId: number) {
    const res = await this.musicStyleService.removeMusicStyle(styleId);

    return BaseModelResponseVO.success(res);
  }
}
