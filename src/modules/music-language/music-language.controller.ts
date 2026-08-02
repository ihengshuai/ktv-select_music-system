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

import { QueryMusicLanguageDTO, CreateMusicLanguageDTO, UpdateMusicLanguageDTO } from "./dto/music-language.dto";
import { MusicLanguageService } from "./music-language.service";
import { MusicLanguageVO } from "./vo/music-language.vo";

@ApiTags("歌曲语种管理")
@Controller("music-language")
export class MusicLanguageController {
  constructor(private readonly musicLanguageService: MusicLanguageService) {}

  /**
   * 获取歌曲语种列表
   */
  @ApiOperation({ summary: "获取歌曲语种列表" })
  @ApiListResponse(MusicLanguageVO)
  @Get()
  async getSongLanguageList(@Query() query: QueryMusicLanguageDTO, @Query() pagination: PaginationDTO) {
    const { items, pager } = await this.musicLanguageService.getMusicLanguageList(query, pagination);

    return BaseListResponseVO.success(items, pager);
  }

  /**
   * 新增歌曲语种
   */
  @ApiOperation({ summary: "新增歌曲语种" })
  @ApiModelResponse(MusicLanguageVO)
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post()
  async createSongLanguage(@Body() createMusicLanguageDTO: CreateMusicLanguageDTO) {
    const res = await this.musicLanguageService.createMusicLanguage(createMusicLanguageDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 修改歌曲语种
   */
  @ApiOperation({ summary: "修改歌曲语种" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post("update/:id")
  async updateSongLanguage(@Param("id") languageId: number, @Body() updateMusicLanguageDTO: UpdateMusicLanguageDTO) {
    const res = await this.musicLanguageService.updateMusicLanguage(languageId, updateMusicLanguageDTO);

    return BaseModelResponseVO.success(res);
  }

  /**
   * 删除歌曲语种
   */
  @ApiOperation({ summary: "删除歌曲语种" })
  @ApiResponse({ status: 200, description: "成功", type: Boolean })
  @UseGuards(AuthenticationBaseGuard, AuthenticationRoleGuard)
  @Role(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete("delete/:id")
  async removeSongLanguage(@Param("id") languageId: number) {
    const res = await this.musicLanguageService.removeMusicLanguage(languageId);

    return BaseModelResponseVO.success(res);
  }
}
