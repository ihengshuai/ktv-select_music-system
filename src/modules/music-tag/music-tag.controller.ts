import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Role } from "@/common/decorator";
import { AuthenticationBaseGuard } from "@/common/guard/authentication-base.guard";
import { AuthenticationRoleGuard } from "@/common/guard/authentication-role.guard";
import { ApiListResponse, ApiModelResponse } from "@/common/swagger";
import { USER_ROLE } from "@/consts";
import { PaginationDTO } from "@/dto/base-pagination.dto";
import { BaseListResponseVO } from "@/vo/base-list-response.vo";
import { BaseModelResponseVO } from "@/vo/base-model-response.vo";

import { QueryMusicTagDTO, CreateMusicTagDTO, UpdateMusicTagDTO } from "./dto/music-tag.dto";
import { MusicTagService } from "./music-tag.service";
import { MusicTagVO } from "./vo/music-tag.vo";

@ApiTags("歌曲标签管理")
@Controller("music-tag")
export class MusicTagController {
  constructor(private readonly musicTagService: MusicTagService) {}

  /**
   * 获取歌曲标签列表
   */
  @ApiOperation({ summary: "获取歌曲标签列表" })
  @ApiListResponse(MusicTagVO)
  @Get()
  async getSongTagList(@Query() query: QueryMusicTagDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.musicTagService.getMusicTagList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌曲标签
   */
  @ApiOperation({ summary: "新增歌曲标签" })
  @ApiModelResponse(MusicTagVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post()
  async createSongTag(@Body() createMusicTagDTO: CreateMusicTagDTO) {
    const res = await this.musicTagService.createMusicTag(createMusicTagDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 修改歌曲标签
   */
  @ApiOperation({ summary: "修改歌曲标签" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSongTag(@Param("id") tagId: number, @Body() updateMusicTagDTO: UpdateMusicTagDTO) {
    const res = await this.musicTagService.updateMusicTag(tagId, updateMusicTagDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌曲标签
   */
  @ApiOperation({ summary: "删除歌曲标签" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSongTag(@Param("id") tagId: number) {
    const res = await this.musicTagService.removeMusicTag(tagId);

    return BaseModelResponseVO.success(res);
  }
}
